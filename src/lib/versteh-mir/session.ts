import { demoAdapter, grokBuildAdapter, manualAdapter, type AgentAdapter } from "./adapters.ts";
import { MemoryBroker } from "./broker.ts";
import { liveIds } from "./ids.ts";
import { applyEffect, createState, reduce } from "./machine.ts";
import type {
  Awaiting,
  Channel,
  Event,
  IdFactory,
  SessionState,
  Signal,
} from "./types.ts";

const ADAPTERS: Record<"demo" | "manual" | "grok-build", AgentAdapter> = {
  demo: demoAdapter,
  manual: manualAdapter,
  "grok-build": grokBuildAdapter,
};

export type StageLabel = "Dein Wunsch" | "Verständigung" | "Plan der KI" | "Ergebnis" | "Angehalten";

export type View = {
  connected: boolean;
  connectionLabel: string;
  stageLabel: StageLabel;
  atomText: string;
  atomKind: string;
  awaiting: Awaiting;
  signalsEnabled: boolean;
  canStop: boolean;
  canReset: boolean;
  files: Record<string, string>;
};

export function stageLabel(state: SessionState): StageLabel {
  switch (state.phase) {
    case "idle":
    case "review_intent":
      return "Dein Wunsch";
    case "understanding":
      return "Verständigung";
    case "planning":
    case "review_plan":
    case "executing":
      return "Plan der KI";
    case "result":
      return "Ergebnis";
    case "blocked":
      return "Angehalten";
  }
}

export function toView(state: SessionState, files: Record<string, string>): View {
  const atomText = state.currentAtom?.plainText ?? "";
  return {
    connected: state.adapterConnected,
    connectionLabel: state.adapterConnected
      ? `Verbunden mit ${state.adapterDisplayName}`
      : "Nicht verbunden",
    stageLabel: stageLabel(state),
    atomText,
    atomKind: state.currentAtom?.kind ?? "reflection",
    awaiting: state.awaiting,
    signalsEnabled: state.awaiting === "signal" && Boolean(state.currentAtom?.requiresSignal),
    canStop: state.phase !== "idle",
    canReset: state.phase !== "idle",
    files,
  };
}

export type Session = {
  view(): View;
  snapshot(): SessionState;
  workspace(): Record<string, string>;
  submit(text: string, channel?: Channel): View;
  signal(signal: Signal, channel?: Channel, namedTerm?: string): View;
  stop(): View;
  reset(): View;
};

export function createSession(opts?: {
  adapter?: "demo" | "manual" | "grok-build";
  ids?: IdFactory;
}): Session {
  const adapter = ADAPTERS[opts?.adapter ?? "demo"];
  const ids = opts?.ids ?? liveIds();
  const probe = adapter.probe();
  const adapterMeta = {
    adapterId: adapter.id,
    adapterDisplayName: adapter.displayName,
    adapterConnected: probe.connected,
  };
  const broker = new MemoryBroker();
  let state = createState(ids, adapterMeta);
  broker.bindSession(state.sessionId);

  function run(event: Event): View {
    const reduced = reduce(state, event);
    state = applyEffect(reduced.state, reduced.effect, {
      createPlan: (intent) => adapter.createPlan(intent, ids),
      execute: (plan, grant) => {
        broker.issue(grant);
        return broker.execute(plan, grant, reduced.state.sessionId, ids.now());
      },
      read: (plan) => {
        const grant = reduced.state.planningGrant;
        if (!grant) {
          return {
            planHash: plan.planHash,
            completed: [],
            blocked: ["Keine Lesefreigabe."],
            failed: [],
            measuredSummary: "Keine Lesefreigabe.",
            filesAfter: broker.snapshot(),
          };
        }
        const result = broker.executeRead(plan, grant);
        if (!result.blocked.length && plan.expectedResult) {
          return { ...result, measuredSummary: plan.expectedResult };
        }
        return result;
      },
    });
    return toView(state, broker.snapshot());
  }

  return {
    view: () => toView(state, broker.snapshot()),
    snapshot: () => state,
    workspace: () => broker.snapshot(),
    submit: (text, channel = "keyboard") => run({ type: "human_input", text, channel }),
    signal: (signal, channel = "button", namedTerm) =>
      run({ type: "human_signal", signal, channel, namedTerm }),
    stop: () => run({ type: "stop" }),
    reset: () => {
      broker.reset();
      state = createState(ids, adapterMeta);
      broker.bindSession(state.sessionId);
      return toView(state, broker.snapshot());
    },
  };
}
