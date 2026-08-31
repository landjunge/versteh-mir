import { iso } from "./ids.ts";
import { SIGNAL_PROMPT } from "./signals.ts";
import type {
  OriginalFragment,
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

export function createState(
  ids: SessionState["ids"],
  adapter: Pick<SessionState, "adapterId" | "adapterDisplayName" | "adapterConnected">,
): SessionState {
  const sessionId = ids.id("sess");
  const welcome =
    "Sag, was du gerade sagen kannst. Ein Wunsch, ein Problem, ein Wort oder: Ich habe keinen Plan.";
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

export function block(state: SessionState, message: string): ReduceResult {
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
