import { iso } from "./ids.ts";
import {
  classifyOpening,
  exploreIntentSummary,
  extractGermanNouns,
  mirrorClearIntent,
  mirrorNoPlan,
  mirrorRelation,
  orientQuestion,
  orientReadIntent,
  orientReadOffer,
  relationQuestion,
} from "./meaning.ts";
import { deterministicEngine } from "./engine.ts";
import {
  isExplainBare,
  isIDontKnow,
  isResetPhrase,
  isStopPhrase,
  parseGarNichtsTerm,
  parseSignal,
  SIGNAL_PROMPT,
  TERM_PROMPT,
} from "./signals.ts";
import type {
  ActionPlan,
  ApprovalGrant,
  Channel,
  Effect,
  Event,
  ExecutionResult,
  IntentSpec,
  MeaningEdge,
  MeaningNode,
  OriginalFragment,
  ReduceResult,
  SessionState,
  SharedUnderstanding,
  Signal,
  UnderstandingAtom,
} from "./types.ts";

const GRANT_MS = 5 * 60 * 1000;

function atom(
  state: SessionState,
  kind: UnderstandingAtom["kind"],
  plainText: string,
  requiresSignal: boolean,
  sourceIds: string[] = [],
): UnderstandingAtom {
  return {
    id: state.ids.id("atom"),
    kind,
    plainText,
    sourceIds,
    requiresSignal,
  };
}

function emptyUnderstanding(sessionId: string): SharedUnderstanding {
  return {
    sessionId,
    revision: 0,
    originalFragments: [],
    groundedFacts: [],
    unknowns: [],
    openQuestions: [],
    nodes: [],
    edges: [],
    currentAtom: null,
  };
}

export function createState(
  ids: SessionState["ids"],
  adapter: Pick<SessionState, "adapterId" | "adapterDisplayName" | "adapterConnected">,
): SessionState {
  const sessionId = ids.id("sess");
  const welcome = "Sag, was du gerade sagen kannst. Ein Wunsch, ein Problem, ein Wort oder: Ich habe keinen Plan.";
  const currentAtom = {
    id: ids.id("atom"),
    kind: "reflection" as const,
    plainText: welcome,
    sourceIds: [],
    requiresSignal: false,
  };
  return {
    sessionId,
    ids,
    adapterId: adapter.adapterId,
    adapterDisplayName: adapter.adapterDisplayName,
    adapterConnected: adapter.adapterConnected,
    phase: "idle",
    loop: { kind: "idle" },
    awaiting: "none",
    understanding: { ...emptyUnderstanding(sessionId), currentAtom },
    intent: null,
    plan: null,
    planningGrant: null,
    approvalGrant: null,
    result: null,
    currentAtom,
    lastExplainedTerm: null,
    representation: "plain",
  };
}

function withAtom(state: SessionState, next: UnderstandingAtom, awaiting: SessionState["awaiting"]): SessionState {
  return {
    ...state,
    currentAtom: next,
    awaiting,
    understanding: {
      ...state.understanding,
      currentAtom: next,
    },
  };
}

function addFragment(state: SessionState, text: string): { state: SessionState; fragment: OriginalFragment } {
  const fragment: OriginalFragment = {
    id: state.ids.id("frag"),
    text,
    createdAt: iso(state.ids.now()),
  };
  return {
    fragment,
    state: {
      ...state,
      understanding: {
        ...state.understanding,
        originalFragments: [...state.understanding.originalFragments, fragment],
        revision: state.understanding.revision + 1,
      },
    },
  };
}

function addFact(state: SessionState, value: string, fragmentId: string): SessionState {
  return {
    ...state,
    understanding: {
      ...state.understanding,
      groundedFacts: [
        ...state.understanding.groundedFacts,
        {
          id: state.ids.id("fact"),
          value,
          source: "human_statement",
          evidenceFragmentIds: [fragmentId],
        },
      ],
    },
  };
}

function originalText(state: SessionState): string {
  return state.understanding.originalFragments[0]?.text ?? "";
}

function none(state: SessionState): ReduceResult {
  return { state, effect: { type: "none" } };
}

function askWhich(state: SessionState): ReduceResult {
  return none(withAtom(state, atom(state, "question", SIGNAL_PROMPT, false), "signal"));
}

function dropPlan(state: SessionState): SessionState {
  return {
    ...state,
    plan: null,
    approvalGrant: null,
    planningGrant: null,
  };
}

export function reduce(state: SessionState, event: Event): ReduceResult {
  if (event.type === "stop") return stop(state);
  if (event.type === "reset") return none(createState(state.ids, state));
  if (event.type === "plan_created") return acceptPlan(state, event.plan);
  if (event.type === "plan_failed") return block(state, event.message);
  if (event.type === "execution_finished") return acceptResult(state, event.result);
  if (event.type === "execution_blocked") return block(state, event.message);
  if (event.type === "human_signal") {
    return applySignal(state, event.signal, event.channel, event.namedTerm);
  }
  if (event.type === "human_input") return handleHuman(state, event.text, event.channel);
  return none(state);
}

function stop(state: SessionState): ReduceResult {
  const next = withAtom(
    {
      ...dropPlan(state),
      phase: "blocked",
      loop: { kind: "blocked", message: "Angehalten." },
      intent: null,
      result: null,
    },
    atom(state, "result", "Angehalten. Nichts weiter. Du kannst von vorn beginnen.", false),
    "none",
  );
  return none(next);
}

function block(state: SessionState, message: string): ReduceResult {
  const next = withAtom(
    {
      ...dropPlan(state),
      phase: "blocked",
      loop: { kind: "blocked", message },
    },
    atom(state, "result", message, false),
    "none",
  );
  return none(next);
}

function handleHuman(state: SessionState, raw: string, channel: Channel): ReduceResult {
  const text = raw.trim();
  if (!text) return none(state);
  if (isStopPhrase(text)) return stop(state);
  if (isResetPhrase(text)) return none(createState(state.ids, state));

  if (state.phase === "idle" || state.phase === "result" || state.phase === "blocked") {
    const base = state.phase === "idle" ? state : createState(state.ids, state);
    return open(base, text);
  }

  const named = parseGarNichtsTerm(text);
  if (named) {
    return applySignal(state, "gar_nichts", channel, named);
  }
  if (isExplainBare(text)) {
    return applySignal(state, "gar_nichts", channel);
  }

  const signal = parseSignal(text);
  if (signal) return applySignal(state, signal, channel);

  if (state.awaiting === "term") {
    const word = text.match(/[A-Za-zÄÖÜäöüß]+/)?.[0] ?? text;
    return explainNamed(state, word);
  }
  if (state.awaiting === "free_answer") {
    return applyAnswer(state, text);
  }
  return askWhich(state);
}

function open(state: SessionState, text: string): ReduceResult {
  const added = addFragment(state, text);
  let next = added.state;
  const kind = classifyOpening(text);

  if (kind === "cannot_follow") {
    next = {
      ...next,
      phase: "understanding",
      loop: { kind: "follow", step: "ask_term" },
      understanding: {
        ...next.understanding,
        unknowns: [...next.understanding.unknowns, "welcher Teil unverständlich ist"],
      },
    };
    return none(withAtom(next, atom(next, "question", TERM_PROMPT, false), "term"));
  }

  if (kind === "no_plan") {
    next = addFact(next, "Kein nächster Schritt ist bestätigt.", added.fragment.id);
    next = {
      ...next,
      phase: "understanding",
      loop: { kind: "orient", step: "reflect" },
      understanding: {
        ...next.understanding,
        unknowns: ["was als Nächstes wichtig ist"],
      },
    };
    return none(
      withAtom(next, atom(next, "reflection", mirrorNoPlan(text), true, [added.fragment.id]), "signal"),
    );
  }

  if (kind === "explore") {
    const nouns = extractGermanNouns(text);
    const from = nouns[0] ?? "A";
    const to = nouns[1] ?? "B";
    const extraNouns = nouns.slice(2);
    const nodes: MeaningNode[] = nouns.map((label) => ({
      id: next.ids.id("node"),
      label,
      originalFragmentIds: [added.fragment.id],
    }));
    const openEdge: MeaningEdge = {
      id: next.ids.id("edge"),
      from: nodes[0]?.id ?? from,
      to: nodes[1]?.id ?? to,
      relation: "",
      source: "ai_hypothesis",
      status: "open",
      evidenceFragmentIds: [],
    };
    next = {
      ...next,
      phase: "understanding",
      loop: { kind: "explore", step: "ask", from, to, pendingRelation: null, extraNouns },
      understanding: {
        ...next.understanding,
        nodes,
        edges: [openEdge],
        unknowns: [`wie ${from} und ${to} zusammenhängen`],
      },
    };
    return none(
      withAtom(next, atom(next, "question", relationQuestion(from, to), false, [added.fragment.id]), "free_answer"),
    );
  }

  return toIntent(next, text, added.fragment.id);
}

function toIntent(state: SessionState, text: string, fragmentId: string): ReduceResult {
  const mirrored = mirrorClearIntent(text);
  const intent: IntentSpec = {
    id: state.ids.id("intent"),
    understandingRevision: state.understanding.revision,
    goal: text.trim(),
    target: mirrored.target,
    nextAllowedStep: "plan_only",
    constraints: mirrored.constraints,
    forbiddenEffects: ["löschen", "senden", "Geheimnisse lesen"],
    unresolved: mirrored.unresolved,
    plainSummary: mirrored.summary,
    sourceIds: [fragmentId],
  };
  const next: SessionState = {
    ...state,
    phase: "review_intent",
    loop: { kind: "review_intent" },
    intent,
    plan: null,
    approvalGrant: null,
    understanding: {
      ...state.understanding,
      unknowns: mirrored.unresolved,
    },
  };
  return none(withAtom(next, atom(next, "intent", mirrored.summary, true, [fragmentId]), "signal"));
}

function applyAnswer(state: SessionState, text: string): ReduceResult {
  const added = addFragment(state, text);
  let next = added.state;

  if (isIDontKnow(text) && next.loop.kind === "orient") {
    next = {
      ...next,
      loop: { kind: "orient", step: "offer_read" },
      representation: next.representation === "plain" ? "example" : "plain",
    };
    return none(withAtom(next, atom(next, "question", orientReadOffer(), true, [added.fragment.id]), "signal"));
  }

  if (next.loop.kind === "orient" && next.loop.step === "question") {
    next = addFact(next, text.trim(), added.fragment.id);
    return toOrientReadIntent(next, added.fragment.id);
  }

  if (next.loop.kind === "explore" && next.loop.step === "ask") {
    const { from, to, extraNouns } = next.loop;
    const edges = next.understanding.edges.map((edge, index) =>
      index === 0
        ? {
            ...edge,
            relation: text.trim(),
            source: "human_statement" as const,
            status: "open" as const,
            evidenceFragmentIds: [added.fragment.id],
          }
        : edge,
    );
    next = {
      ...next,
      loop: { kind: "explore", step: "mirror", from, to, pendingRelation: text.trim(), extraNouns },
      understanding: { ...next.understanding, edges },
    };
    return none(
      withAtom(
        next,
        atom(next, "relation", mirrorRelation(from, to, text), true, [added.fragment.id]),
        "signal",
      ),
    );
  }

  if (next.loop.kind === "clarify_intent" && next.intent) {
    const merged = `${next.intent.goal} ${text}`.trim();
    return toIntent(next, merged, added.fragment.id);
  }

  if (next.loop.kind === "clarify_plan" && next.intent) {
    const bumped: IntentSpec = {
      ...next.intent,
      id: next.ids.id("intent"),
      understandingRevision: next.understanding.revision,
      goal: `${next.intent.goal} ${text}`.trim(),
    };
    const ready: SessionState = {
      ...dropPlan(next),
      intent: bumped,
      phase: "planning",
      loop: { kind: "planning" },
      planningGrant: {
        sessionId: next.sessionId,
        intentId: bumped.id,
        understandingRevision: bumped.understandingRevision,
        readOnly: true,
      },
    };
    return {
      state: withAtom(ready, atom(ready, "plan_effect", "Einen Moment. Es wird nur ein Plan erstellt.", false), "none"),
      effect: { type: "create_plan", intent: bumped },
    };
  }

  if (next.loop.kind === "follow") {
    return open(createState(next.ids, next), text);
  }

  return askWhich(next);
}

function toOrientReadIntent(state: SessionState, fragmentId: string): ReduceResult {
  const summary = orientReadIntent();
  const intent: IntentSpec = {
    id: state.ids.id("intent"),
    understandingRevision: state.understanding.revision,
    goal: "Nur den aktuellen Stand lesen, nichts verändern.",
    target: "PROJECT.md",
    nextAllowedStep: "orient_read",
    constraints: ["nur lesen"],
    forbiddenEffects: ["ändern", "löschen", "senden"],
    unresolved: [],
    plainSummary: summary,
    sourceIds: [fragmentId],
  };
  const next: SessionState = {
    ...state,
    phase: "review_intent",
    loop: { kind: "review_intent" },
    intent,
  };
  return none(withAtom(next, atom(next, "intent", summary, true, [fragmentId]), "signal"));
}

function applySignal(
  state: SessionState,
  signal: Signal,
  _channel: Channel,
  namedTerm?: string,
): ReduceResult {
  if (state.phase === "idle" || state.phase === "blocked") return none(state);
  if (state.phase === "result" && signal !== "gar_nichts") return none(state);
  if (state.awaiting === "none" && state.phase !== "review_plan") return none(state);

  if (signal === "gar_nichts") {
    if (!namedTerm) {
      const next = { ...state, loop: state.loop };
      return none(withAtom(next, atom(state, "question", TERM_PROMPT, false), "term"));
    }
    return explainNamed(state, namedTerm);
  }

  if (signal === "unsicher") {
    return clarify(state);
  }

  return confirmWeiss(state);
}

function explainNamed(state: SessionState, term: string): ReduceResult {
  const text = deterministicEngine.explainTerm(term, state.representation);
  const next: SessionState = {
    ...state,
    lastExplainedTerm: term,
    representation: state.representation === "plain" ? "example" : "plain",
    loop: state.loop.kind === "follow" ? { kind: "follow", step: "explained" } : state.loop,
    phase: state.phase === "idle" ? "understanding" : state.phase,
  };
  return none(withAtom(next, atom(next, "term", text, true), "signal"));
}

function clarify(state: SessionState): ReduceResult {
  if (state.phase === "review_plan" || state.loop.kind === "review_plan") {
    const next: SessionState = {
      ...state,
      phase: "understanding",
      loop: { kind: "clarify_plan" },
    };
    return none(
      withAtom(
        next,
        atom(next, "question", "Welcher Punkt an diesem Plan ist unklar oder möglicherweise falsch?", false),
        "free_answer",
      ),
    );
  }
  if (state.phase === "review_intent" || state.loop.kind === "review_intent") {
    const next: SessionState = {
      ...state,
      phase: "understanding",
      loop: { kind: "clarify_intent" },
    };
    return none(
      withAtom(
        next,
        atom(next, "question", "Welcher Punkt an diesem Wunsch ist unklar oder möglicherweise falsch?", false),
        "free_answer",
      ),
    );
  }
  if (state.loop.kind === "explore") {
    return none(
      withAtom(
        state,
        atom(state, "question", `Was genau an ${state.loop.from} und ${state.loop.to} ist unklar?`, false),
        "free_answer",
      ),
    );
  }
  if (state.loop.kind === "orient") {
    return none(
      withAtom(
        state,
        atom(state, "question", "Welcher Teil dieses Satzes ist unklar?", false),
        "free_answer",
      ),
    );
  }
  return none(
    withAtom(state, atom(state, "question", "Welcher Punkt ist unklar?", false), "free_answer"),
  );
}

function confirmWeiss(state: SessionState): ReduceResult {
  if (state.currentAtom && !state.currentAtom.requiresSignal) {
    return askWhich(state);
  }

  if (state.loop.kind === "follow" && state.loop.step === "explained") {
    const next: SessionState = { ...state, phase: "understanding", loop: { kind: "follow", step: "explained" } };
    return none(
      withAtom(next, atom(next, "question", "Was möchtest du als Nächstes sagen?", false), "free_answer"),
    );
  }

  if (state.loop.kind === "orient" && state.loop.step === "reflect") {
    const source = originalText(state);
    const next: SessionState = { ...state, loop: { kind: "orient", step: "question" } };
    return none(withAtom(next, atom(next, "question", orientQuestion(source), false), "free_answer"));
  }

  if (state.loop.kind === "orient" && state.loop.step === "offer_read") {
    return toOrientReadIntent(state, state.understanding.originalFragments.at(-1)?.id ?? "");
  }

  if (state.loop.kind === "explore" && state.loop.step === "mirror") {
    const { from, to, pendingRelation, extraNouns } = state.loop;
    const relation = pendingRelation ?? "";
    const edges = state.understanding.edges.map((edge, index) =>
      index === 0 ? { ...edge, status: "confirmed" as const, source: "human_confirmation" as const } : edge,
    );
    if (extraNouns[0] && !relation) {
      /* keep going */
    }
    const summary = exploreIntentSummary(from, to, relation);
    const intent: IntentSpec = {
      id: state.ids.id("intent"),
      understandingRevision: state.understanding.revision,
      goal: summary,
      target: null,
      nextAllowedStep: "plan_only",
      constraints: ["noch nichts bauen"],
      forbiddenEffects: ["ändern", "löschen", "senden"],
      unresolved: extraNouns.length ? [`wie ${extraNouns[0]} dazugehört`] : [],
      plainSummary: extraNouns.length
        ? `${summary.replace(/Stimmt das\?$/, "").trim()} Noch offen: wie ${extraNouns[0]} dazugehört. Stimmt das?`
        : summary,
      sourceIds: state.understanding.originalFragments.map((f) => f.id),
    };
    const next: SessionState = {
      ...state,
      phase: "review_intent",
      loop: { kind: "review_intent" },
      intent,
      understanding: { ...state.understanding, edges },
    };
    return none(withAtom(next, atom(next, "intent", intent.plainSummary, true, intent.sourceIds), "signal"));
  }

  if (state.phase === "review_intent" && state.intent) {
    return startPlanning(state, state.intent);
  }

  if (state.phase === "review_plan" && state.plan) {
    return startExecute(state);
  }

  if (state.loop.kind === "follow") {
    return none(
      withAtom(state, atom(state, "question", "Was möchtest du als Nächstes sagen?", false), "free_answer"),
    );
  }

  return none(state);
}

function startPlanning(state: SessionState, intent: IntentSpec): ReduceResult {
  if (!state.adapterConnected) {
    return none(
      withAtom(
        { ...state, phase: "review_intent" },
        atom(state, "result", "Nicht verbunden. Der Auftrag ist nicht gegangen.", true),
        "signal",
      ),
    );
  }
  const planningGrant = {
    sessionId: state.sessionId,
    intentId: intent.id,
    understandingRevision: intent.understandingRevision,
    readOnly: true as const,
  };
  const next: SessionState = {
    ...state,
    phase: "planning",
    loop: { kind: "planning" },
    planningGrant,
    approvalGrant: null,
    plan: null,
  };
  return {
    state: withAtom(next, atom(next, "plan_effect", "Einen Moment. Es wird nur ein Plan erstellt.", false), "none"),
    effect: { type: "create_plan", intent },
  };
}

function startExecute(state: SessionState): ReduceResult {
  const plan = state.plan;
  if (!plan) return block(state, "Kein Plan.");
  const writes = plan.operations.some((op) => op.risk !== "read");
  if (!writes) {
    return none(state);
  }
  const grant: ApprovalGrant = {
    sessionId: state.sessionId,
    planHash: plan.planHash,
    nonce: state.ids.id("nonce"),
    expiresAt: state.ids.now() + GRANT_MS,
    singleUse: true,
    used: false,
  };
  const next: SessionState = {
    ...state,
    phase: "executing",
    loop: { kind: "executing" },
    approvalGrant: grant,
  };
  return {
    state: withAtom(next, atom(next, "plan_effect", "Die freigegebene Handlung läuft genau einmal.", false), "none"),
    effect: { type: "execute", plan, grant },
  };
}

function acceptPlan(state: SessionState, plan: ActionPlan): ReduceResult {
  if (state.phase !== "planning" || !state.intent || !state.planningGrant) {
    return block(state, "Ein Plan kam ohne Planungsfreigabe.");
  }
  if (plan.intentId !== state.intent.id) {
    return block(state, "Der Plan gehört nicht zu diesem Wunsch.");
  }
  const readsOnly = plan.operations.every((op) => op.risk === "read");
  const next: SessionState = {
    ...state,
    plan,
    phase: readsOnly ? "review_plan" : "review_plan",
    loop: { kind: "review_plan", opIndex: 0 },
  };
  if (readsOnly) {
    return {
      state: withAtom(next, atom(next, "plan_effect", deterministicEngine.explainPlan(plan), true), "signal"),
      effect: { type: "none" },
    };
  }
  return none(withAtom(next, atom(next, "plan_effect", deterministicEngine.explainPlan(plan), true), "signal"));
}

function acceptResult(state: SessionState, result: ExecutionResult): ReduceResult {
  const next: SessionState = {
    ...dropPlan(state),
    phase: "result",
    loop: { kind: "result" },
    result,
    approvalGrant: state.approvalGrant ? { ...state.approvalGrant, used: true } : null,
  };
  return none(withAtom(next, atom(next, "result", deterministicEngine.explainResult(result), false), "none"));
}

export function applyEffect(
  state: SessionState,
  effect: Effect,
  deps: {
    createPlan: (intent: IntentSpec) => ActionPlan;
    execute: (plan: ActionPlan, grant: ApprovalGrant) => ExecutionResult;
    read: (plan: ActionPlan) => ExecutionResult;
  },
): SessionState {
  let current = state;
  let nextEffect = effect;
  for (let i = 0; i < 4; i++) {
    if (nextEffect.type === "none") return current;
    if (nextEffect.type === "create_plan") {
      try {
        const plan = deps.createPlan(nextEffect.intent);
        const verdict = deterministicEngine.inspectPlan(plan, nextEffect.intent);
        if (!verdict.ok) {
          const message = `${verdict.reason} ${deterministicEngine.explainPlan(plan)}`;
          return reduce(current, { type: "plan_failed", message }).state;
        }
        const reduced = reduce(current, { type: "plan_created", plan });
        current = reduced.state;
        const readsOnly = plan.operations.every((op) => op.risk === "read");
        if (readsOnly && current.planningGrant) {
          const result = deps.read(plan);
          if (result.blocked.length) {
            return reduce(current, { type: "execution_blocked", message: result.measuredSummary }).state;
          }
          return reduce(current, { type: "execution_finished", result }).state;
        }
        nextEffect = reduced.effect;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Plan fehlgeschlagen.";
        return reduce(current, { type: "plan_failed", message }).state;
      }
      continue;
    }
    if (nextEffect.type === "execute") {
      const result = deps.execute(nextEffect.plan, nextEffect.grant);
      if (result.blocked.length) {
        return reduce(current, { type: "execution_blocked", message: result.measuredSummary }).state;
      }
      return reduce(current, { type: "execution_finished", result }).state;
    }
  }
  return current;
}
