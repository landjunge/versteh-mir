import { iso } from "./ids.ts";
import { SIGNAL_PROMPT } from "./signals.ts";
import type {
  Loop,
  OriginalFragment,
  Phase,
  ReduceResult,
  SessionState,
  SharedUnderstanding,
  UnderstandingAtom,
} from "./types.ts";

export function atom(
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

export function phaseOf(loop: Loop): Phase {
  switch (loop.kind) {
    case "idle":
      return "idle";
    case "orient":
    case "explore":
    case "follow":
    case "clarify_intent":
    case "clarify_plan":
      return "understanding";
    case "review_intent":
      return "review_intent";
    case "planning":
      return "planning";
    case "review_plan":
      return "review_plan";
    case "executing":
      return "executing";
    case "result":
      return "result";
    case "blocked":
      return "blocked";
  }
}

export function move(
  state: SessionState,
  loop: Loop,
  patch: Partial<
    Pick<
      SessionState,
      | "intent"
      | "plan"
      | "planningGrant"
      | "approvalGrant"
      | "result"
      | "understanding"
      | "representation"
      | "lastExplainedTerm"
    >
  > = {},
): SessionState {
  return { ...state, ...patch, loop, phase: phaseOf(loop) };
}

export function createState(
  ids: SessionState["ids"],
  adapter: Pick<SessionState, "adapterId" | "adapterDisplayName" | "adapterConnected">,
): SessionState {
  const sessionId = ids.id("sess");
  const welcome =
    "Sag, was du gerade sagen kannst. Ein Wunsch, ein Problem, ein Wort oder: Ich habe keinen Plan.";
  const currentAtom: UnderstandingAtom = {
    id: ids.id("atom"),
    kind: "reflection",
    plainText: welcome,
    sourceIds: [],
    requiresSignal: false,
  };
  return move(
    {
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
    },
    { kind: "idle" },
  );
}

export function withAtom(
  state: SessionState,
  next: UnderstandingAtom,
  awaiting: SessionState["awaiting"],
): SessionState {
  return {
    ...state,
    currentAtom: next,
    awaiting,
    understanding: { ...state.understanding, currentAtom: next },
  };
}

export function addFragment(
  state: SessionState,
  text: string,
): { state: SessionState; fragment: OriginalFragment } {
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

export function addFact(state: SessionState, value: string, fragmentId: string): SessionState {
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

export function originalText(state: SessionState): string {
  return state.understanding.originalFragments[0]?.text ?? "";
}

export function none(state: SessionState): ReduceResult {
  return { state, effect: { type: "none" } };
}

export function askWhich(state: SessionState): ReduceResult {
  return none(withAtom(state, atom(state, "question", SIGNAL_PROMPT, false), "signal"));
}

export function dropPlan(state: SessionState): SessionState {
  return {
    ...state,
    plan: null,
    approvalGrant: null,
    planningGrant: null,
  };
}

export function stop(state: SessionState): ReduceResult {
  return none(
    withAtom(
      move(
        { ...dropPlan(state), intent: null, result: null },
        { kind: "blocked", message: "Angehalten." },
      ),
      atom(state, "result", "Angehalten. Nichts weiter. Du kannst von vorn beginnen.", false),
      "none",
    ),
  );
}

export function block(state: SessionState, message: string): ReduceResult {
  return none(
    withAtom(
      move(dropPlan(state), { kind: "blocked", message }),
      atom(state, "result", message, false),
      "none",
    ),
  );
}
