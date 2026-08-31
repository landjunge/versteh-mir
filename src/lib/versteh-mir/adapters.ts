import { withPlanHash } from "./hash.ts";
import { planEffectText, readOrientationResult } from "./meaning.ts";
import type { ActionPlan, IntentSpec } from "./types.ts";

export type AgentAdapter = {
  readonly id: "demo" | "manual" | "grok-build";
  readonly displayName: string;
  probe(): { connected: boolean; reason?: string };
  createPlan(intent: IntentSpec, ids: { id: (p: string) => string }): ActionPlan;
};

export const demoAdapter: AgentAdapter = {
  id: "demo",
  displayName: "Demo",
  probe() {
    return { connected: true };
  },
  createPlan(intent, ids) {
    if (intent.nextAllowedStep === "orient_read") {
      const operations = [
        {
          id: ids.id("op"),
          capability: "read",
          target: "PROJECT.md",
          arguments: {},
          effect: "Ich würde nur den Testbereich lesen.",
          risk: "read" as const,
          reversible: true,
        },
      ];
      return withPlanHash({
        id: ids.id("plan"),
        intentId: intent.id,
        understandingRevision: intent.understandingRevision,
        operations,
        expectedResult: readOrientationResult(),
      });
    }

    const noBuild = intent.constraints.some((c) => /nichts bauen|nicht bauen/i.test(c));
    if (noBuild) {
      const operations = [
        {
          id: ids.id("op"),
          capability: "noop",
          target: "PROJECT.md",
          arguments: {},
          effect: "Es würde nichts gebaut und keine Datei verändert.",
          risk: "read" as const,
          reversible: true,
        },
      ];
      return withPlanHash({
        id: ids.id("plan"),
        intentId: intent.id,
        understandingRevision: intent.understandingRevision,
        operations,
        expectedResult: "Nichts wurde verändert.",
      });
    }

    const target = intent.target ?? "README.md";
    const replacement =
      intent.unresolved.length > 0
        ? "Projektsatz: noch vom Menschen zu setzen."
        : "Nicht besser prompten. Erst dasselbe meinen.";
    const operations = [
      {
        id: ids.id("op"),
        capability: "replace_sentence",
        target,
        arguments: { replacement },
        effect: `Die Datei ${target} würde den Projektsatz ändern.`,
        risk: "local_change" as const,
        reversible: true,
      },
    ];
    return withPlanHash({
      id: ids.id("plan"),
      intentId: intent.id,
      understandingRevision: intent.understandingRevision,
      operations,
      expectedResult: `${target} wurde geändert. Sonst wurde nichts verändert.`,
    });
  },
};

export const manualAdapter: AgentAdapter = {
  id: "manual",
  displayName: "Manual",
  probe() {
    return { connected: false, reason: "Manual kopiert den Wunsch. Keine Agentenverbindung." };
  },
  createPlan(intent, ids) {
    const operations = [
      {
        id: ids.id("op"),
        capability: "noop",
        target: "PROJECT.md",
        arguments: { copy: intent.plainSummary },
        effect: "Nichts wird automatisch ausgeführt. Du kannst den Wunsch selbst weitergeben.",
        risk: "read" as const,
        reversible: true,
      },
    ];
    return withPlanHash({
      id: ids.id("plan"),
      intentId: intent.id,
      understandingRevision: intent.understandingRevision,
      operations,
      expectedResult: "Nichts wurde verändert.",
    });
  },
};

export const grokBuildAdapter: AgentAdapter = {
  id: "grok-build",
  displayName: "Grok Build",
  probe() {
    return {
      connected: false,
      reason: "Keine unterstützte lokale Schnittstelle. Verbindung wird nicht vorgetäuscht.",
    };
  },
  createPlan() {
    throw new Error("Nicht verbunden.");
  },
};

export function effectAtomText(plan: ActionPlan): string {
  return planEffectText(plan.operations);
}

export { planEffectText };
