import {
  classifyOpening,
  explainTerm as glossaryTerm,
  explainTermAsExample,
  extractGermanNouns,
  mirrorClearIntent,
  mirrorNoPlan,
  orientQuestion,
  orientReadIntent,
  orientReadOffer,
  relationQuestion,
} from "./meaning.ts";
import type {
  ActionPlan,
  ExecutionResult,
  IntentSpec,
  MeaningEdge,
  PlannedOperation,
  SharedUnderstanding,
  Signal,
} from "./types.ts";

export type OrientationState = {
  input: string;
  known: string[];
  unknown: string[];
  question: string | null;
  reflection: string;
  step: "reflect" | "question" | "offer_read" | "intent";
};

export type PlanInspection = { ok: true } | { ok: false; reason: string };

export type MeaningEngine = {
  startOrientation(input: string): OrientationState;
  continueOrientation(state: OrientationState, answer: string): OrientationState | IntentSpec;
  stepBack(
    state: OrientationState,
    reason: "unsicher" | "gar_nichts" | "keine_antwort",
  ): OrientationState;
  exploreConnection(map: SharedUnderstanding, input: string): SharedUnderstanding;
  proposePattern(map: SharedUnderstanding): { relation: MeaningEdge; question: string } | null;
  confirmConnection(map: SharedUnderstanding, edgeId: string, signal: Signal): SharedUnderstanding;
  mirrorIntent(input: string): IntentSpec;
  askIntentQuestion(intent: IntentSpec): string;
  applyIntentAnswer(intent: IntentSpec, answer: string): IntentSpec;
  explainTerm(term: string, context: string): string;
  explainPlan(plan: ActionPlan): string;
  askPlanQuestion(plan: ActionPlan): string;
  explainResult(result: ExecutionResult): string;
  inspectPlan(plan: ActionPlan, intent?: IntentSpec | null): PlanInspection;
};

const MAX_OPERATIONS = 6;
const MAX_TARGETS = 3;

function isDelete(op: PlannedOperation): boolean {
  return op.risk === "destructive" || /delete|unlink|remove|rm\b|löschen/i.test(op.capability);
}

function isSend(op: PlannedOperation): boolean {
  return op.risk === "external_send" || /send|upload|http|fetch|network|mail/i.test(op.capability);
}

function isSecret(op: PlannedOperation): boolean {
  return op.risk === "secret_access" || /secret|key|token|password|credential/i.test(op.capability);
}

function isCost(op: PlannedOperation): boolean {
  return op.risk === "financial" || /pay|charge|bill|invoice|purchase/i.test(op.capability);
}

function isChange(op: PlannedOperation): boolean {
  return (
    op.risk === "local_change" ||
    op.capability === "write" ||
    op.capability === "replace_sentence"
  );
}

function names(ops: PlannedOperation[]): string {
  const unique = [...new Set(ops.map((op) => op.target))];
  if (unique.length === 0) return "";
  if (unique.length === 1) return unique[0] ?? "";
  return `${unique.slice(0, -1).join(", ")} und ${unique.at(-1)}`;
}

export function criticalEffects(plan: ActionPlan): {
  change: PlannedOperation[];
  del: PlannedOperation[];
  send: PlannedOperation[];
  secret: PlannedOperation[];
  cost: PlannedOperation[];
  irreversible: PlannedOperation[];
} {
  return {
    change: plan.operations.filter(isChange),
    del: plan.operations.filter(isDelete),
    send: plan.operations.filter(isSend),
    secret: plan.operations.filter(isSecret),
    cost: plan.operations.filter(isCost),
    irreversible: plan.operations.filter((op) => !op.reversible),
  };
}

export function explainPlanFromOperations(plan: ActionPlan): string {
  const fx = criticalEffects(plan);
  const parts: string[] = [];
  if (fx.change.length) parts.push(`Die Datei ${names(fx.change)} würde geändert.`);
  else parts.push("Keine Datei würde verändert.");
  if (fx.del.length) parts.push(`Es würde gelöscht: ${names(fx.del)}.`);
  else parts.push("Nichts würde gelöscht.");
  if (fx.send.length) parts.push(`Etwas würde den Rechner verlassen: ${names(fx.send)}.`);
  else parts.push("Nichts würde den Rechner verlassen.");
  if (fx.secret.length) parts.push(`Es würden Geheimnisse benötigt: ${names(fx.secret)}.`);
  else parts.push("Keine Geheimnisse würden gelesen.");
  if (fx.cost.length) parts.push("Es würden Kosten entstehen.");
  else parts.push("Es entstünden keine Kosten.");
  if (fx.irreversible.length) parts.push("Das wäre nicht rückgängig zu machen.");
  if (plan.operations.length === 0) {
    return "Es würde nichts gelesen, nichts verändert, nichts gelöscht und nichts gesendet. Stimmt das?";
  }
  return `${parts.join(" ")} Stimmt das?`;
}

export function inspectPlanAgainstIntent(plan: ActionPlan, intent?: IntentSpec | null): PlanInspection {
  if (plan.operations.length > MAX_OPERATIONS) {
    return { ok: false, reason: "Der Plan ist zu lang. Es müsste in kleinere Schritte geteilt werden." };
  }
  const targets = new Set(plan.operations.map((op) => op.target));
  if (targets.size > MAX_TARGETS) {
    return { ok: false, reason: "Der Plan betrifft zu viele Ziele auf einmal." };
  }
  const fx = criticalEffects(plan);
  const forbidden = (intent?.forbiddenEffects ?? []).join(" ").toLowerCase();
  const constraints = (intent?.constraints ?? []).join(" ").toLowerCase();
  if (fx.del.length && /lösch/.test(forbidden)) {
    return { ok: false, reason: "Der Plan würde löschen, obwohl das nicht erlaubt war." };
  }
  if (fx.send.length && /send/.test(forbidden)) {
    return { ok: false, reason: "Der Plan würde etwas senden, obwohl das nicht erlaubt war." };
  }
  if (fx.secret.length && /geheim/.test(forbidden)) {
    return { ok: false, reason: "Der Plan würde Geheimnisse brauchen, obwohl das nicht erlaubt war." };
  }
  if (intent?.nextAllowedStep === "orient_read" && (fx.change.length || fx.del.length || fx.send.length)) {
    return { ok: false, reason: "Zugelassen war nur lesen. Der Plan würde etwas verändern." };
  }
  if (/nur lesen/.test(constraints) && (fx.change.length || fx.del.length)) {
    return { ok: false, reason: "Zugelassen war nur lesen. Der Plan würde etwas verändern." };
  }
  if (/sonst nichts|nichts bauen|nicht bauen/.test(constraints) && fx.change.length > 1) {
    return { ok: false, reason: "Der Plan würde mehr ändern als erlaubt." };
  }
  for (const op of plan.operations) {
    if (op.risk === "read" && isChange(op)) {
      return { ok: false, reason: "Der Plan widerspricht sich: als Lesen gekennzeichnet, würde aber ändern." };
    }
  }
  const pretendsIdle = /^(nichts (wurde|würde) verändert|nichts passiert|es würde nichts)/i.test(
    plan.expectedResult.trim(),
  );
  if (pretendsIdle && (fx.change.length || fx.del.length || fx.send.length || fx.secret.length || fx.cost.length)) {
    return { ok: false, reason: "Der Plan widerspricht sich: die Zusammenfassung verschweigt die Wirkung." };
  }
  return { ok: true };
}

function emptyIntent(input: string, extras: Partial<IntentSpec>): IntentSpec {
  return {
    id: "intent_preview",
    understandingRevision: 0,
    goal: input.trim(),
    target: null,
    nextAllowedStep: "plan_only",
    constraints: [],
    forbiddenEffects: ["löschen", "senden", "Geheimnisse lesen"],
    unresolved: [],
    plainSummary: input.trim(),
    sourceIds: [],
    ...extras,
  };
}

export const deterministicEngine: MeaningEngine = {
  startOrientation(input) {
    const kind = classifyOpening(input);
    if (kind === "no_plan") {
      return {
        input,
        known: [],
        unknown: ["welcher nächste Schritt"],
        question: null,
        reflection: mirrorNoPlan(input),
        step: "reflect",
      };
    }
    return {
      input,
      known: extractGermanNouns(input),
      unknown: [],
      question: null,
      reflection: mirrorClearIntent(input).summary,
      step: "intent",
    };
  },

  continueOrientation(state, answer) {
    if (/^(ich )?(weiß|weiss) (es )?nicht/.test(answer.trim().toLowerCase()) || !answer.trim()) {
      return this.stepBack(state, "keine_antwort");
    }
    if (state.step === "reflect") {
      return {
        ...state,
        known: [...state.known, answer.trim()],
        question: orientQuestion(state.input),
        step: "question",
      };
    }
    if (state.step === "question") {
      return emptyIntent(state.input, {
        goal: "Nur den aktuellen Stand lesen, nichts verändern.",
        target: "PROJECT.md",
        nextAllowedStep: "orient_read",
        constraints: ["nur lesen"],
        forbiddenEffects: ["ändern", "löschen", "senden"],
        plainSummary: orientReadIntent(),
      });
    }
    return emptyIntent(answer, {
      ...mirrorClearIntent(answer),
      plainSummary: mirrorClearIntent(answer).summary,
    });
  },

  stepBack(state) {
    return {
      ...state,
      unknown: [...state.unknown, "die letzte Antwort"],
      question: orientReadOffer(),
      reflection: orientReadOffer(),
      step: "offer_read",
    };
  },

  exploreConnection(map, input) {
    const nouns = extractGermanNouns(input);
    return {
      ...map,
      unknowns: nouns.length >= 2 ? [`wie ${nouns[0]} und ${nouns[1]} zusammenhängen`] : map.unknowns,
    };
  },

  proposePattern(map) {
    const open = map.edges.find((edge) => edge.status === "open");
    const from = map.nodes.find((n) => n.id === open?.from)?.label;
    const to = map.nodes.find((n) => n.id === open?.to)?.label;
    if (!open || !from || !to) return null;
    return { relation: open, question: relationQuestion(from, to) };
  },

  confirmConnection(map, edgeId, signal) {
    return {
      ...map,
      edges: map.edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              status: signal === "weiss" ? "confirmed" : signal === "gar_nichts" ? "open" : "open",
              source: signal === "weiss" ? "human_confirmation" : edge.source,
            }
          : edge,
      ),
    };
  },

  mirrorIntent(input) {
    const mirrored = mirrorClearIntent(input);
    return emptyIntent(input, {
      target: mirrored.target,
      constraints: mirrored.constraints,
      unresolved: mirrored.unresolved,
      plainSummary: mirrored.summary,
    });
  },

  askIntentQuestion(intent) {
    const open = intent.unresolved[0];
    if (open) return `Was fehlt noch: ${open}?`;
    return "Welcher Punkt an diesem Wunsch ist unklar?";
  },

  applyIntentAnswer(intent, answer) {
    const trimmed = answer.trim();
    if (!trimmed || /^(ich )?(weiß|weiss) (es )?nicht/i.test(trimmed)) {
      return {
        ...intent,
        unresolved: intent.unresolved.length ? intent.unresolved : ["diese Angabe"],
      };
    }
    const rest = intent.unresolved.slice(1);
    return {
      ...intent,
      unresolved: rest,
      plainSummary: rest.length
        ? `${intent.goal}. Noch offen: ${rest[0]}. Stimmt das?`
        : intent.plainSummary,
    };
  },

  explainTerm(term, context) {
    const word = term.trim().split(/\s+/)[0] ?? term;
    if (/example|beispiel/i.test(context)) return explainTermAsExample(word);
    return glossaryTerm(word);
  },

  explainPlan(plan) {
    return explainPlanFromOperations(plan);
  },

  askPlanQuestion(plan) {
    const fx = criticalEffects(plan);
    if (fx.del.length) return "Welcher Punkt am Löschen ist unklar?";
    if (fx.send.length) return "Was genau würde den Rechner verlassen — und wohin?";
    return "Welcher Punkt an diesem Plan ist unklar oder möglicherweise falsch?";
  },

  explainResult(result) {
    if (result.blocked.length) return result.measuredSummary;
    const project = result.filesAfter["PROJECT.md"] ?? "";
    const unchanged =
      /nur gelesen/i.test(result.measuredSummary) || /nichts wurde verändert/i.test(result.measuredSummary);
    if (unchanged && /Offen: der nächste Schritt/i.test(project)) {
      return "Im Testbereich steht noch kein nächster Schritt fest. Eine mögliche Richtung: zuerst nur den Projektsatz in der README klären. Sonst wurde nichts verändert.";
    }
    return result.measuredSummary;
  },

  inspectPlan(plan, intent) {
    return inspectPlanAgainstIntent(plan, intent);
  },
};
