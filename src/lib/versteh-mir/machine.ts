import { deterministicEngine } from "./engine.ts";
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
import {
  isExplainBare,
  isIDontKnow,
  isResetPhrase,
  isStopPhrase,
  parseGarNichtsTerm,
  parseSignal,
  TERM_PROMPT,
} from "./signals.ts";
import {
  addFact,
  addFragment,
  askWhich,
  atom,
  block,
  createState,
  dropPlan,
  move,
  none,
  originalText,
  stop,
  withAtom,
} from "./state.ts";
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
  ReduceResult,
  SessionState,
  Signal,
  PlanningGrant,
} from "./types.ts";

export { createState } from "./state.ts";

const GRANT_MS = 5 * 60 * 1000;

export function reduce(state: SessionState, event: Event): ReduceResult {
  switch (event.type) {
    case "stop":
      return stop(state);
    case "reset":
      return none(createState(state.ids, state));
    case "plan_created":
      return acceptPlan(state, event.plan);
    case "plan_failed":
      return block(state, event.message);
    case "execution_finished":
      return acceptResult(state, event.result);
    case "execution_blocked":
      return block(state, event.message);
    case "human_signal":
      return applySignal(state, event.signal, event.channel, event.namedTerm);
    case "human_input":
      return handleHuman(state, event.text, event.channel);
  }
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
  if (named) return applySignal(state, "gar_nichts", channel, named);
  if (isExplainBare(text)) return applySignal(state, "gar_nichts", channel);
  const signal = parseSignal(text);
  if (signal) return applySignal(state, signal, channel);
  if (state.awaiting === "term") {
    return explainNamed(state, text.match(/[A-Za-zÄÖÜäöüß]+/)?.[0] ?? text);
  }
  if (state.awaiting === "free_answer") return applyAnswer(state, text);
  return askWhich(state);
}

function open(state: SessionState, text: string): ReduceResult {
  const added = addFragment(state, text);
  const kind = classifyOpening(text);

  if (kind === "cannot_follow") {
    const next = move(added.state, { kind: "follow", step: "ask_term" }, {
      understanding: {
        ...added.state.understanding,
        unknowns: [...added.state.understanding.unknowns, "welcher Teil unverständlich ist"],
      },
    });
    return none(withAtom(next, atom(next, "question", TERM_PROMPT, false), "term"));
  }

  if (kind === "no_plan") {
    let next = addFact(added.state, "Kein nächster Schritt ist bestätigt.", added.fragment.id);
    next = move(next, { kind: "orient", step: "reflect" }, {
      understanding: { ...next.understanding, unknowns: ["was als Nächstes wichtig ist"] },
    });
    return none(withAtom(next, atom(next, "reflection", mirrorNoPlan(text), true, [added.fragment.id]), "signal"));
  }

  if (kind === "explore") {
    const nouns = extractGermanNouns(text);
    const from = nouns[0] ?? "A";
    const to = nouns[1] ?? "B";
    const extraNouns = nouns.slice(2);
    const nodes: MeaningNode[] = nouns.map((label) => ({
      id: added.state.ids.id("node"),
      label,
      originalFragmentIds: [added.fragment.id],
    }));
    const openEdge: MeaningEdge = {
      id: added.state.ids.id("edge"),
      from: nodes[0]?.id ?? from,
      to: nodes[1]?.id ?? to,
      relation: "",
      source: "ai_hypothesis",
      status: "open",
      evidenceFragmentIds: [],
    };
    const next = move(
      added.state,
      { kind: "explore", step: "ask", from, to, pendingRelation: null, extraNouns },
      {
        understanding: {
          ...added.state.understanding,
          nodes,
          edges: [openEdge],
          unknowns: [`wie ${from} und ${to} zusammenhängen`],
        },
      },
    );
    return none(
      withAtom(next, atom(next, "question", relationQuestion(from, to), false, [added.fragment.id]), "free_answer"),
    );
  }

  return toIntent(added.state, text, added.fragment.id);
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
  const next = move(state, { kind: "review_intent" }, {
    intent,
    plan: null,
    approvalGrant: null,
    understanding: { ...state.understanding, unknowns: mirrored.unresolved },
  });
  return none(withAtom(next, atom(next, "intent", mirrored.summary, true, [fragmentId]), "signal"));
}

function applyAnswer(state: SessionState, text: string): ReduceResult {
  const added = addFragment(state, text);
  const next = added.state;
  const loop = next.loop;

  switch (loop.kind) {
    case "orient": {
      if (isIDontKnow(text)) {
        const stepped = move(next, { kind: "orient", step: "offer_read" }, {
          representation: next.representation === "plain" ? "example" : "plain",
        });
        return none(withAtom(stepped, atom(stepped, "question", orientReadOffer(), true, [added.fragment.id]), "signal"));
      }
      if (loop.step === "question") {
        return toOrientReadIntent(addFact(next, text.trim(), added.fragment.id), added.fragment.id);
      }
      return askWhich(next);
    }
    case "explore": {
      if (loop.step !== "ask") return askWhich(next);
      const { from, to, extraNouns } = loop;
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
      const mirrored = move(
        next,
        { kind: "explore", step: "mirror", from, to, pendingRelation: text.trim(), extraNouns },
        { understanding: { ...next.understanding, edges } },
      );
      return none(
        withAtom(mirrored, atom(mirrored, "relation", mirrorRelation(from, to, text), true, [added.fragment.id]), "signal"),
      );
    }
    case "clarify_intent":
      return next.intent ? toIntent(next, `${next.intent.goal} ${text}`.trim(), added.fragment.id) : askWhich(next);
    case "clarify_plan":
      return next.intent ? replan(next, `${next.intent.goal} ${text}`.trim()) : askWhich(next);
    case "follow":
      return open(createState(next.ids, next), text);
    case "idle":
    case "review_intent":
    case "planning":
    case "review_plan":
    case "executing":
    case "result":
    case "blocked":
      return askWhich(next);
  }
}

function replan(state: SessionState, goal: string): ReduceResult {
  const intent: IntentSpec = {
    ...state.intent!,
    id: state.ids.id("intent"),
    understandingRevision: state.understanding.revision,
    goal,
  };
  const grant: PlanningGrant = {
    sessionId: state.sessionId,
    intentId: intent.id,
    understandingRevision: intent.understandingRevision,
    readOnly: true,
  };
  const ready = move(dropPlan(state), { kind: "planning" }, { intent, planningGrant: grant });
  return {
    state: withAtom(ready, atom(ready, "plan_effect", "Einen Moment. Es wird nur ein Plan erstellt.", false), "none"),
    effect: { type: "create_plan", intent },
  };
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
  const next = move(state, { kind: "review_intent" }, { intent });
  return none(withAtom(next, atom(next, "intent", summary, true, [fragmentId]), "signal"));
}

function applySignal(state: SessionState, signal: Signal, _channel: Channel, namedTerm?: string): ReduceResult {
  if (state.phase === "idle" || state.phase === "blocked") return none(state);
  if (state.phase === "result" && signal !== "gar_nichts") return none(state);
  if (state.awaiting === "none" && state.phase !== "review_plan") return none(state);

  switch (signal) {
    case "gar_nichts":
      if (!namedTerm) {
        return none(withAtom(state, atom(state, "question", TERM_PROMPT, false), "term"));
      }
      return explainNamed(state, namedTerm);
    case "unsicher":
      return clarify(state);
    case "weiss":
      return confirmWeiss(state);
  }
}

function explainNamed(state: SessionState, term: string): ReduceResult {
  const text = deterministicEngine.explainTerm(term, state.representation);
  const loop = state.loop.kind === "follow" ? ({ kind: "follow", step: "explained" } as const) : state.loop;
  const next = move(state, loop, {
    lastExplainedTerm: term,
    representation: state.representation === "plain" ? "example" : "plain",
  });
  return none(withAtom(next, atom(next, "term", text, true), "signal"));
}

function clarify(state: SessionState): ReduceResult {
  switch (state.loop.kind) {
    case "review_plan": {
      const next = move(state, { kind: "clarify_plan" });
      return none(
        withAtom(
          next,
          atom(next, "question", "Welcher Punkt an diesem Plan ist unklar oder möglicherweise falsch?", false),
          "free_answer",
        ),
      );
    }
    case "review_intent": {
      const next = move(state, { kind: "clarify_intent" });
      return none(
        withAtom(
          next,
          atom(next, "question", "Welcher Punkt an diesem Wunsch ist unklar oder möglicherweise falsch?", false),
          "free_answer",
        ),
      );
    }
    case "explore":
      return none(
        withAtom(
          state,
          atom(state, "question", `Was genau an ${state.loop.from} und ${state.loop.to} ist unklar?`, false),
          "free_answer",
        ),
      );
    case "orient":
      return none(
        withAtom(state, atom(state, "question", "Welcher Teil dieses Satzes ist unklar?", false), "free_answer"),
      );
    default:
      return none(withAtom(state, atom(state, "question", "Welcher Punkt ist unklar?", false), "free_answer"));
  }
}

function confirmWeiss(state: SessionState): ReduceResult {
  if (state.currentAtom && !state.currentAtom.requiresSignal) return askWhich(state);

  switch (state.loop.kind) {
    case "follow":
      return none(
        withAtom(state, atom(state, "question", "Was möchtest du als Nächstes sagen?", false), "free_answer"),
      );
    case "orient":
      if (state.loop.step === "reflect") {
        const next = move(state, { kind: "orient", step: "question" });
        return none(withAtom(next, atom(next, "question", orientQuestion(originalText(state)), false), "free_answer"));
      }
      if (state.loop.step === "offer_read") {
        return toOrientReadIntent(state, state.understanding.originalFragments.at(-1)?.id ?? "");
      }
      return none(state);
    case "explore":
      return state.loop.step === "mirror" ? confirmExplore(state) : none(state);
    case "review_intent":
      return state.intent ? startPlanning(state, state.intent) : none(state);
    case "review_plan":
      return state.plan ? startExecute(state) : none(state);
    case "idle":
    case "planning":
    case "executing":
    case "result":
    case "blocked":
    case "clarify_intent":
    case "clarify_plan":
      return none(state);
  }
}

function confirmExplore(state: SessionState): ReduceResult {
  if (state.loop.kind !== "explore") return none(state);
  const { from, to, pendingRelation, extraNouns } = state.loop;
  const relation = pendingRelation ?? "";
  const edges = state.understanding.edges.map((edge, index) =>
    index === 0 ? { ...edge, status: "confirmed" as const, source: "human_confirmation" as const } : edge,
  );
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
  const next = move(state, { kind: "review_intent" }, {
    intent,
    understanding: { ...state.understanding, edges },
  });
  return none(withAtom(next, atom(next, "intent", intent.plainSummary, true, intent.sourceIds), "signal"));
}

function startPlanning(state: SessionState, intent: IntentSpec): ReduceResult {
  if (!state.adapterConnected) {
    return none(
      withAtom(
        move(state, { kind: "review_intent" }),
        atom(state, "result", "Nicht verbunden. Der Auftrag ist nicht gegangen.", true),
        "signal",
      ),
    );
  }
  const planningGrant: PlanningGrant = {
    sessionId: state.sessionId,
    intentId: intent.id,
    understandingRevision: intent.understandingRevision,
    readOnly: true,
  };
  const next = move(state, { kind: "planning" }, { planningGrant, approvalGrant: null, plan: null });
  return {
    state: withAtom(next, atom(next, "plan_effect", "Einen Moment. Es wird nur ein Plan erstellt.", false), "none"),
    effect: { type: "create_plan", intent },
  };
}

function startExecute(state: SessionState): ReduceResult {
  const plan = state.plan;
  if (!plan) return block(state, "Kein Plan.");
  if (plan.operations.every((op) => op.risk === "read")) return none(state);
  const grant: ApprovalGrant = {
    sessionId: state.sessionId,
    planHash: plan.planHash,
    nonce: state.ids.id("nonce"),
    expiresAt: state.ids.now() + GRANT_MS,
    singleUse: true,
    used: false,
  };
  const next = move(state, { kind: "executing" }, { approvalGrant: grant });
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
  const next = move(state, { kind: "review_plan", opIndex: 0 }, { plan });
  return none(withAtom(next, atom(next, "plan_effect", deterministicEngine.explainPlan(plan), true), "signal"));
}

function acceptResult(state: SessionState, result: ExecutionResult): ReduceResult {
  const next = move(dropPlan(state), { kind: "result" }, {
    result,
    approvalGrant: state.approvalGrant ? { ...state.approvalGrant, used: true } : null,
  });
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
    switch (nextEffect.type) {
      case "none":
        return current;
      case "create_plan": {
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
        break;
      }
      case "execute": {
        const result = deps.execute(nextEffect.plan, nextEffect.grant);
        if (result.blocked.length) {
          return reduce(current, { type: "execution_blocked", message: result.measuredSummary }).state;
        }
        return reduce(current, { type: "execution_finished", result }).state;
      }
    }
  }
  return current;
}
