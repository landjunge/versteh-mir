import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { INITIAL_FILES, MemoryBroker, resolveTarget } from "./broker.ts";
import { canonicalPlan, hashCanonical, withPlanHash } from "./hash.ts";
import type { ActionPlan, ApprovalGrant, PlannedOperation } from "./types.ts";

function op(partial: Partial<PlannedOperation> & Pick<PlannedOperation, "capability" | "target">): PlannedOperation {
  return {
    id: partial.id ?? "op_1",
    capability: partial.capability,
    target: partial.target,
    arguments: partial.arguments ?? { replacement: "Neu." },
    effect: partial.effect ?? "Die Datei README.md würde den Projektsatz ändern.",
    risk: partial.risk ?? (partial.capability === "read" || partial.capability === "noop" ? "read" : "local_change"),
    reversible: partial.reversible ?? true,
  };
}

function plan(operations: PlannedOperation[], extra?: Partial<ActionPlan>): ActionPlan {
  return withPlanHash({
    id: extra?.id ?? "plan_1",
    intentId: extra?.intentId ?? "intent_1",
    understandingRevision: extra?.understandingRevision ?? 1,
    operations,
    expectedResult: extra?.expectedResult ?? "README.md wurde geändert. Sonst wurde nichts verändert.",
  });
}

function grantFor(planValue: ActionPlan, extra?: Partial<ApprovalGrant>): ApprovalGrant {
  return {
    sessionId: extra?.sessionId ?? "sess_1",
    planHash: extra?.planHash ?? planValue.planHash,
    nonce: extra?.nonce ?? "nonce_1",
    expiresAt: extra?.expiresAt ?? 1_700_000_000_000 + 60_000,
    singleUse: true,
    used: extra?.used ?? false,
  };
}

describe("resolveTarget", () => {
  it("rejects parent paths, slashes and hidden names", () => {
    assert.equal(resolveTarget("README.md"), "README.md");
    assert.equal(resolveTarget("../README.md"), null);
    assert.equal(resolveTarget("..\\README.md"), null);
    assert.equal(resolveTarget("/etc/passwd"), null);
    assert.equal(resolveTarget("docs/README.md"), null);
    assert.equal(resolveTarget(".env"), null);
    assert.equal(resolveTarget(".."), null);
  });
});

describe("capability broker", () => {
  it("does not write without an issued grant", () => {
    const broker = new MemoryBroker();
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const g = grantFor(p);
    const result = broker.execute(p, g, "sess_1", 1_700_000_000_000);
    assert.match(result.blocked[0] ?? "", /nicht ausgestellt/);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("does not write without any grant", () => {
    const broker = new MemoryBroker();
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const result = broker.execute(p, null, "sess_1", 1_700_000_000_000);
    assert.match(result.blocked[0] ?? "", /Keine Handlungsfreigabe/);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("rejects a changed plan with an old grant", () => {
    const broker = new MemoryBroker();
    const original = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const g = grantFor(original);
    assert.equal(broker.issue(g), null);
    const mutated: ActionPlan = {
      ...original,
      operations: [
        op({ capability: "replace_sentence", target: "README.md" }),
        op({
          id: "op_2",
          capability: "write",
          target: "PROJECT.md",
          arguments: { content: "heimlich" },
          effect: "Zusätzliche Datei.",
        }),
      ],
    };
    mutated.planHash = original.planHash;
    const result = broker.execute(mutated, g, "sess_1", 1_700_000_000_000);
    assert.match(result.blocked[0] ?? "", /gilt nicht für diesen Plan/);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
    assert.equal(broker.snapshot()["PROJECT.md"], INITIAL_FILES["PROJECT.md"]);
  });

  it("blocks a reused grant", () => {
    const broker = new MemoryBroker();
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const g = grantFor(p);
    assert.equal(broker.issue(g), null);
    const first = broker.execute(p, g, "sess_1", 1_700_000_000_000);
    assert.equal(first.blocked.length, 0);
    assert.notEqual(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
    const afterFirst = broker.snapshot()["README.md"];
    const second = broker.execute(p, { ...g, used: false }, "sess_1", 1_700_000_000_000);
    assert.match(second.blocked[0] ?? "", /bereits verwendet/);
    assert.equal(broker.snapshot()["README.md"], afterFirst);
  });

  it("blocks an expired grant", () => {
    const broker = new MemoryBroker();
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const g = grantFor(p, { expiresAt: 1_700_000_000_000 + 10 });
    assert.equal(broker.issue(g), null);
    const result = broker.execute(p, g, "sess_1", 1_700_000_000_000 + 11);
    assert.match(result.blocked[0] ?? "", /abgelaufen/);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("blocks a grant from another session", () => {
    const broker = new MemoryBroker();
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const g = grantFor(p, { sessionId: "sess_1" });
    assert.equal(broker.issue(g), null);
    const result = broker.execute(p, g, "sess_other", 1_700_000_000_000);
    assert.match(result.blocked[0] ?? "", /anderen Sitzung/);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("stops unplanned extra files and path traversal", () => {
    const broker = new MemoryBroker();
    const p = plan([
      op({
        capability: "write",
        target: "../SECRET.md",
        arguments: { content: "x" },
        effect: "Pfad nach oben.",
      }),
    ]);
    const g = grantFor(p);
    assert.equal(broker.issue(g), null);
    const result = broker.execute(p, g, "sess_1", 1_700_000_000_000);
    assert.ok(result.blocked.length);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
    assert.equal(Object.keys(broker.snapshot()).sort().join(","), "PROJECT.md,README.md");
  });

  it("does not write with only a planning grant", () => {
    const broker = new MemoryBroker();
    broker.bindSession("sess_1");
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const result = broker.executeRead(p, {
      sessionId: "sess_1",
      intentId: p.intentId,
      understandingRevision: p.understandingRevision,
      readOnly: true,
    });
    assert.match(result.blocked[0] ?? "", /Ohne Handlungsfreigabe/);
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("reset restores the workspace and drops old grants", () => {
    const broker = new MemoryBroker();
    const p = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const g = grantFor(p);
    assert.equal(broker.issue(g), null);
    broker.execute(p, g, "sess_1", 1_700_000_000_000);
    assert.notEqual(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
    broker.reset();
    assert.equal(broker.snapshot()["README.md"], INITIAL_FILES["README.md"]);
    const again = broker.execute(p, g, "sess_1", 1_700_000_000_000);
    assert.match(again.blocked[0] ?? "", /nicht ausgestellt/);
  });

  it("hash changes when an operation changes", () => {
    const a = plan([op({ capability: "replace_sentence", target: "README.md" })]);
    const b = plan([
      op({
        capability: "replace_sentence",
        target: "README.md",
        arguments: { replacement: "Anderer Satz." },
      }),
    ]);
    assert.notEqual(a.planHash, b.planHash);
    assert.equal(a.planHash, hashCanonical(canonicalPlan(a)));
  });
});
