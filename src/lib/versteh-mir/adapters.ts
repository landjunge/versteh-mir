import { withPlanHash } from "./hash.ts";
import { readOrientationResult } from "./meaning.ts";
import type { ActionPlan, IntentSpec, PlannedOperation } from "./types.ts";

export type AgentAdapter = {
  readonly id: "demo" | "manual" | "grok-build";
  readonly displayName: string;
  probe(): { connected: boolean; reason?: string };
  createPlan(intent: IntentSpec, ids: { id: (p: string) => string }): ActionPlan;
};

function op(ids: { id: (p: string) => string }, fields: Omit<PlannedOperation, "id">): PlannedOperation {
  return { id: ids.id("op"), ...fields };
}

export const demoAdapter: AgentAdapter = {
  id: "demo",
  displayName: "Demo",
  probe() {
    return { connected: true };
  },
  createPlan(intent, ids) {
    if (intent.nextAllowedStep === "orient_read") {
      return withPlanHash({
        id: ids.id("plan"),
        intentId: intent.id,
        understandingRevision: intent.understandingRevision,
        operations: [
          op(ids, {
            capability: "read",
            target: "PROJECT.md",
            arguments: {},
            effect: "Ich würde nur den Testbereich lesen.",
            risk: "read",
            reversible: true,
          }),
        ],
        expectedResult: readOrientationResult(),
      });
    }

    const noBuild = intent.constraints.some((c) => /nichts bauen|nicht bauen/i.test(c));
    if (noBuild) {
      return withPlanHash({
        id: ids.id("plan"),
        intentId: intent.id,
        understandingRevision: intent.understandingRevision,
        operations: [
          op(ids, {
            capability: "noop",
            target: "PROJECT.md",
            arguments: {},
            effect: "Es würde nichts gebaut und keine Datei verändert.",
            risk: "read",
            reversible: true,
          }),
        ],
        expectedResult: "Nichts wurde verändert.",
      });
    }

    const target = intent.target ?? "README.md";
    const replacement =
      intent.unresolved.length > 0
        ? "Projektsatz: noch vom Menschen zu setzen."
        : "Nicht besser prompten. Erst dasselbe meinen.";
    return withPlanHash({
      id: ids.id("plan"),
      intentId: intent.id,
      understandingRevision: intent.understandingRevision,
      operations: [
        op(ids, {
          capability: "replace_sentence",
          target,
          arguments: { replacement },
          effect: `Die Datei ${target} würde den Projektsatz ändern.`,
          risk: "local_change",
          reversible: true,
        }),
      ],
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
    return withPlanHash({
      id: ids.id("plan"),
      intentId: intent.id,
      understandingRevision: intent.understandingRevision,
      operations: [
        op(ids, {
          capability: "noop",
          target: "PROJECT.md",
          arguments: { copy: intent.plainSummary },
          effect: "Nichts wird automatisch ausgeführt. Du kannst den Wunsch selbst weitergeben.",
          risk: "read",
          reversible: true,
        }),
      ],
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
