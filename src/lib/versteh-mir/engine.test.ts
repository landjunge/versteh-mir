import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deterministicEngine } from "./engine.ts";
import { withPlanHash } from "./hash.ts";
import type { ActionPlan, IntentSpec, PlannedOperation } from "./types.ts";

function op(partial: Partial<PlannedOperation> & Pick<PlannedOperation, "capability" | "risk" | "target">): PlannedOperation {
  return {
    id: partial.id ?? "op_1",
    capability: partial.capability,
    target: partial.target,
    arguments: partial.arguments ?? {},
    effect: partial.effect ?? "Nichts passiert.",
    risk: partial.risk,
    reversible: partial.reversible ?? true,
  };
}

function plan(operations: PlannedOperation[], extra?: Partial<ActionPlan>): ActionPlan {
  return withPlanHash({
    id: extra?.id ?? "plan_1",
    intentId: extra?.intentId ?? "intent_1",
    understandingRevision: extra?.understandingRevision ?? 1,
    operations,
    expectedResult: extra?.expectedResult ?? "Nichts wurde verändert.",
  });
}

const readIntent: IntentSpec = {
  id: "intent_1",
  understandingRevision: 1,
  goal: "nur lesen",
  target: "PROJECT.md",
  nextAllowedStep: "orient_read",
  constraints: ["nur lesen"],
  forbiddenEffects: ["ändern", "löschen", "senden"],
  unresolved: [],
  plainSummary: "nur lesen",
  sourceIds: [],
};

describe("explainPlan", () => {
  it("does not let delete vanish behind harmless prose", () => {
    const p = plan([
      op({
        capability: "delete",
        risk: "destructive",
        target: "README.md",
        effect: "Nichts passiert. Alles bleibt.",
      }),
    ]);
    const text = deterministicEngine.explainPlan(p);
    assert.match(text, /gelöscht/);
    assert.doesNotMatch(text, /Nichts würde gelöscht/);
    assert.equal(text.includes("Nichts passiert"), false);
  });

  it("does not let an external send vanish", () => {
    const p = plan([
      op({
        capability: "upload",
        risk: "external_send",
        target: "README.md",
        effect: "Nur lokal, kein Netz.",
      }),
    ]);
    const text = deterministicEngine.explainPlan(p);
    assert.match(text, /Rechner verlassen/);
    assert.doesNotMatch(text, /Nichts würde den Rechner verlassen/);
  });

  it("does not let secret access vanish", () => {
    const p = plan([
      op({
        capability: "read_secret",
        risk: "secret_access",
        target: ".env",
        effect: "Keine Geheimnisse.",
      }),
    ]);
    const text = deterministicEngine.explainPlan(p);
    assert.match(text, /Geheimnisse/);
    assert.doesNotMatch(text, /Keine Geheimnisse würden gelesen/);
  });

  it("does not let cost vanish", () => {
    const p = plan([
      op({
        capability: "charge",
        risk: "financial",
        target: "invoice",
        effect: "Kostenlos.",
      }),
    ]);
    const text = deterministicEngine.explainPlan(p);
    assert.match(text, /Kosten entstehen/);
    assert.doesNotMatch(text, /keine Kosten/);
  });
});

describe("inspectPlan", () => {
  it("rejects a long plan", () => {
    const operations = Array.from({ length: 8 }, (_, i) =>
      op({
        id: `op_${i}`,
        capability: "read",
        risk: "read",
        target: "README.md",
      }),
    );
    const verdict = deterministicEngine.inspectPlan(plan(operations), readIntent);
    assert.equal(verdict.ok, false);
    if (!verdict.ok) assert.match(verdict.reason, /zu lang/);
  });

  it("rejects a write that contradicts a read-only intent", () => {
    const p = plan([
      op({
        capability: "write",
        risk: "local_change",
        target: "README.md",
        effect: "Nur ansehen.",
      }),
    ]);
    const verdict = deterministicEngine.inspectPlan(p, readIntent);
    assert.equal(verdict.ok, false);
    if (!verdict.ok) assert.match(verdict.reason, /nur lesen/i);
  });
});

describe("unresolved stays open", () => {
  it("does not invent the new project sentence", () => {
    const intent = deterministicEngine.mirrorIntent("Ändere in der README den Projektsatz, aber sonst nichts.");
    assert.ok(intent.unresolved.length);
    assert.match(intent.unresolved[0] ?? "", /Projektsatz/);
    assert.doesNotMatch(intent.plainSummary, /Nicht besser prompten/);
    const stillOpen = deterministicEngine.applyIntentAnswer(intent, "Ich weiß es nicht.");
    assert.ok(stillOpen.unresolved.length);
    assert.doesNotMatch(stillOpen.plainSummary, /Nicht besser prompten/);
  });
});

describe("explainTerm", () => {
  it("explains exactly one named word", () => {
    const text = deterministicEngine.explainTerm("Projektsatz und Adapter", "plain");
    assert.match(text, /Projektsatz/i);
    assert.doesNotMatch(text, /Adapter ist/);
  });
});

describe("explainResult", () => {
  it("uses measured files, not adapter prose", () => {
    const text = deterministicEngine.explainResult({
      planHash: "p1",
      completed: ["op_1"],
      blocked: [],
      failed: [],
      measuredSummary: "README.md wurde geändert. Sonst wurde nichts verändert.",
      filesAfter: {
        "README.md": "geändert",
        "PROJECT.md": "Offen: der nächste Schritt ist noch nicht gewählt.\n",
      },
    });
    assert.match(text, /README.md wurde geändert/);
    assert.doesNotMatch(text, /Nichts passiert/);
  });
});
