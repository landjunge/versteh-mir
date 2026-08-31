export type Signal = "weiss" | "unsicher" | "gar_nichts";

export type Source =
  | "human_statement"
  | "human_confirmation"
  | "approved_observation"
  | "ai_hypothesis";

export type OriginalFragment = {
  id: string;
  text: string;
  createdAt: string;
};

export type GroundedFact = {
  id: string;
  value: string;
  source: Exclude<Source, "ai_hypothesis">;
  evidenceFragmentIds: string[];
};

export type OpenQuestion = {
  id: string;
  question: string;
  about: string;
};

export type MeaningNode = {
  id: string;
  label: string;
  originalFragmentIds: string[];
};

export type MeaningEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
  source: Source;
  status: "open" | "confirmed" | "rejected";
  evidenceFragmentIds: string[];
};

export type AtomKind =
  | "reflection"
  | "question"
  | "term"
  | "relation"
  | "intent"
  | "plan_effect"
  | "result";

export type UnderstandingAtom = {
  id: string;
  kind: AtomKind;
  plainText: string;
  sourceIds: string[];
  requiresSignal: boolean;
};

export type SharedUnderstanding = {
  sessionId: string;
  revision: number;
  originalFragments: OriginalFragment[];
  groundedFacts: GroundedFact[];
  unknowns: string[];
  openQuestions: OpenQuestion[];
  nodes: MeaningNode[];
  edges: MeaningEdge[];
  currentAtom: UnderstandingAtom | null;
};

export type NextAllowedStep = "orient_read" | "plan_only";

export type IntentSpec = {
  id: string;
  understandingRevision: number;
  goal: string;
  target: string | null;
  nextAllowedStep: NextAllowedStep;
  constraints: string[];
  forbiddenEffects: string[];
  unresolved: string[];
  plainSummary: string;
  sourceIds: string[];
};

export type Risk =
  | "read"
  | "local_change"
  | "destructive"
  | "external_send"
  | "secret_access"
  | "financial";

export type PlannedOperation = {
  id: string;
  capability: string;
  target: string;
  arguments: Record<string, unknown>;
  effect: string;
  risk: Risk;
  reversible: boolean;
};

export type ActionPlan = {
  id: string;
  intentId: string;
  understandingRevision: number;
  operations: PlannedOperation[];
  expectedResult: string;
  planHash: string;
};

export type ApprovalGrant = {
  sessionId: string;
  planHash: string;
  nonce: string;
  expiresAt: number;
  singleUse: true;
  used: boolean;
};

export type PlanningGrant = {
  sessionId: string;
  intentId: string;
  understandingRevision: number;
  readOnly: true;
};

export type ExecutionResult = {
  planHash: string;
  completed: string[];
  blocked: string[];
  failed: string[];
  measuredSummary: string;
  filesAfter: Record<string, string>;
};

export type Phase =
  | "idle"
  | "understanding"
  | "review_intent"
  | "planning"
  | "review_plan"
  | "executing"
  | "result"
  | "blocked";

export type Awaiting = "none" | "signal" | "free_answer" | "term";

export type Channel = "keyboard" | "speech" | "button";

export type Loop =
  | { kind: "idle" }
  | { kind: "orient"; step: "reflect" | "question" | "offer_read" }
  | {
      kind: "explore";
      step: "ask" | "mirror";
      from: string;
      to: string;
      pendingRelation: string | null;
      extraNouns: string[];
    }
  | { kind: "follow"; step: "ask_term" | "explained" }
  | { kind: "clarify_intent" }
  | { kind: "clarify_plan" }
  | { kind: "review_intent" }
  | { kind: "planning" }
  | { kind: "review_plan"; opIndex: number }
  | { kind: "executing" }
  | { kind: "result" }
  | { kind: "blocked"; message: string };

export type IdFactory = {
  now: () => number;
  id: (prefix: string) => string;
};

export type SessionState = {
  sessionId: string;
  ids: IdFactory;
  adapterId: "demo" | "manual" | "grok-build";
  adapterDisplayName: string;
  adapterConnected: boolean;
  phase: Phase;
  loop: Loop;
  awaiting: Awaiting;
  understanding: SharedUnderstanding;
  intent: IntentSpec | null;
  plan: ActionPlan | null;
  planningGrant: PlanningGrant | null;
  approvalGrant: ApprovalGrant | null;
  result: ExecutionResult | null;
  currentAtom: UnderstandingAtom | null;
  lastExplainedTerm: string | null;
  representation: "plain" | "example" | "comparison" | "visual";
};

export type Effect =
  | { type: "none" }
  | { type: "create_plan"; intent: IntentSpec }
  | { type: "execute"; plan: ActionPlan; grant: ApprovalGrant };

export type ReduceResult = {
  state: SessionState;
  effect: Effect;
};

export type Event =
  | { type: "human_input"; text: string; channel: Channel }
  | { type: "human_signal"; signal: Signal; channel: Channel; namedTerm?: string }
  | { type: "stop" }
  | { type: "reset" }
  | { type: "plan_created"; plan: ActionPlan }
  | { type: "plan_failed"; message: string }
  | { type: "execution_finished"; result: ExecutionResult }
  | { type: "execution_blocked"; message: string };

export type OpeningKind = "cannot_follow" | "no_plan" | "explore" | "clear_intent";
