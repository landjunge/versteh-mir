import { explainPlan, explainResult, inspectPlan, type PlanInspection } from "./effects.ts";
import { explainTerm as glossaryTerm, explainTermAsExample, mirrorClearIntent } from "./meaning.ts";
import type { ActionPlan, ExecutionResult, IntentSpec } from "./types.ts";

export type MeaningEngine = {
  mirrorIntent(input: string): IntentSpec;
  askIntentQuestion(intent: IntentSpec): string;
  applyIntentAnswer(intent: IntentSpec, answer: string): IntentSpec;
  explainTerm(term: string, context: string): string;
  explainPlan(plan: ActionPlan): string;
  explainResult(result: ExecutionResult): string;
  inspectPlan(plan: ActionPlan, intent?: IntentSpec | null): PlanInspection;
};

function asIntent(input: string, extras: Partial<IntentSpec>): IntentSpec {
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
  mirrorIntent(input) {
    const mirrored = mirrorClearIntent(input);
    return asIntent(input, {
      target: mirrored.target,
      constraints: mirrored.constraints,
      unresolved: mirrored.unresolved,
      plainSummary: mirrored.summary,
    });
  },

  askIntentQuestion(intent) {
    const open = intent.unresolved[0];
    return open ? `Was fehlt noch: ${open}?` : "Welcher Punkt an diesem Wunsch ist unklar?";
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
      plainSummary: rest.length ? `${intent.goal}. Noch offen: ${rest[0]}. Stimmt das?` : intent.plainSummary,
    };
  },

  explainTerm(term, context) {
    const word = term.trim().split(/\s+/)[0] ?? term;
    return /example|beispiel/i.test(context) ? explainTermAsExample(word) : glossaryTerm(word);
  },

  explainPlan,
  explainResult,
  inspectPlan,
};
