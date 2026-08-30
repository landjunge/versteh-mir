import {
  parseGarNichtsTerm,
  parseSignal,
  SIGNAL_PROMPT,
  type Direction,
  type Signal,
} from "./signals.ts";
import { pickOneTerm } from "./terms.ts";

export type { Direction, Signal };

export const AGENT_GROK_BUILD = "grok-build" as const;

export type Phase =
  | "listen"
  | "awaiting_signal"
  | "awaiting_reply_signal"
  | "released";

export type PendingSignal = "warten" | Signal;

export type DaemonState = {
  connectedAgent: typeof AGENT_GROK_BUILD;
  connected: boolean;
  phase: Phase;
  lane: Direction | null;
  wish: string;
  draftSpec: string;
  pendingSignal: PendingSignal;
  lastExplainedTerm: string | null;
  explainedTerms: string[];
  currentText: string;
  translatedReply: string;
};

export type Effect =
  | { type: "none" }
  | { type: "ask_which" }
  | { type: "clarify" }
  | { type: "explain"; term: string }
  | { type: "send_spec"; spec: string }
  | { type: "release" };

export function createState(connected: boolean): DaemonState {
  return {
    connectedAgent: AGENT_GROK_BUILD,
    connected,
    phase: "listen",
    lane: null,
    wish: "",
    draftSpec: "",
    pendingSignal: "warten",
    lastExplainedTerm: null,
    explainedTerms: [],
    currentText: "Mensch → KI oder KI → Mensch. Sag oder füg den Text ein.",
    translatedReply: "",
  };
}

export function setConnected(state: DaemonState, connected: boolean): DaemonState {
  return { ...state, connected };
}

export function literalSpiegel(wish: string): string {
  const trimmed = wish.trim().replace(/\s+/g, " ");
  const body = trimmed.replace(/[.!?]+$/g, "");
  return `Du willst, dass Folgendes passiert: ${body}. Stimmt das?`;
}

export function acceptWish(
  state: DaemonState,
  wish: string,
  spiegel: string,
  lane: Direction = "mensch_ki",
): DaemonState {
  const spec = spiegel.trim();
  return {
    ...state,
    phase: "awaiting_signal",
    lane,
    wish: wish.trim(),
    draftSpec: spec,
    pendingSignal: "warten",
    lastExplainedTerm: null,
    explainedTerms: [],
    currentText: spec,
    translatedReply: "",
  };
}

export function applyUnclear(state: DaemonState): DaemonState {
  return {
    ...state,
    pendingSignal: "warten",
    currentText: SIGNAL_PROMPT,
  };
}

export function acceptClarify(state: DaemonState, question: string): DaemonState {
  return {
    ...state,
    pendingSignal: "warten",
    currentText: question.trim(),
  };
}

export function acceptExplain(
  state: DaemonState,
  term: string,
  explanation: string,
): DaemonState {
  const word = term.trim();
  return {
    ...state,
    pendingSignal: "warten",
    lastExplainedTerm: word,
    explainedTerms: word ? [...state.explainedTerms, word] : state.explainedTerms,
    currentText: explanation.trim(),
  };
}

export function acceptAdapterFailure(state: DaemonState, message: string): DaemonState {
  return {
    ...state,
    phase: "awaiting_signal",
    pendingSignal: "warten",
    currentText: message.trim(),
  };
}

export function acceptAgentTranslation(state: DaemonState, translated: string): DaemonState {
  const text = translated.trim();
  return {
    ...state,
    phase: "awaiting_reply_signal",
    lane: "ki_mensch",
    pendingSignal: "warten",
    translatedReply: text,
    currentText: text,
    explainedTerms: [],
    lastExplainedTerm: null,
  };
}

export function markReleased(state: DaemonState): DaemonState {
  return {
    ...state,
    phase: "released",
    pendingSignal: "weiss",
    currentText: "Freigegeben. Es wird noch nichts geschrieben.",
  };
}

export function reset(state: DaemonState): DaemonState {
  return createState(state.connected);
}

export function applySignal(state: DaemonState, signal: Signal, namedTerm?: string): {
  state: DaemonState;
  effect: Effect;
} {
  if (state.phase === "listen") {
    return { state, effect: { type: "none" } };
  }

  if (state.phase === "released") {
    return { state, effect: { type: "none" } };
  }

  const next: DaemonState = { ...state, pendingSignal: signal };

  if (signal === "weiss") {
    if (state.lane === "ki_mensch" || state.phase === "awaiting_reply_signal") {
      return { state: next, effect: { type: "release" } };
    }
    const spec = state.draftSpec || state.currentText;
    return { state: next, effect: { type: "send_spec", spec } };
  }

  if (signal === "unsicher") {
    return { state: next, effect: { type: "clarify" } };
  }

  const pool =
    state.phase === "awaiting_reply_signal"
      ? state.translatedReply || state.currentText
      : state.draftSpec || state.currentText;
  const term = namedTerm || pickOneTerm(pool, state.explainedTerms);
  if (!term) {
    return {
      state: {
        ...next,
        pendingSignal: "warten",
        currentText: "Ich finde gerade kein Wort, das ich erklären kann.",
      },
      effect: { type: "none" },
    };
  }
  return { state: next, effect: { type: "explain", term } };
}

export function handleFieldSubmit(state: DaemonState, raw: string): {
  state: DaemonState;
  effect: Effect;
  wish?: string;
} {
  const text = raw.trim();
  if (!text) {
    return { state, effect: { type: "none" } };
  }

  if (state.phase === "listen" || state.phase === "released") {
    return { state, effect: { type: "none" }, wish: text };
  }

  const named = parseGarNichtsTerm(text);
  if (named) {
    return applySignal(state, "gar_nichts", named);
  }

  const signal = parseSignal(text);
  if (!signal) {
    return { state: applyUnclear(state), effect: { type: "ask_which" } };
  }
  return applySignal(state, signal);
}
