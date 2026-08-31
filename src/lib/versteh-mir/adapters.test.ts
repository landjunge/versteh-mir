import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { demoAdapter, grokBuildAdapter, manualAdapter } from "./adapters.ts";
import { INITIAL_FILES } from "./broker.ts";
import { createSession } from "./session.ts";
import { testIds } from "./ids.ts";

describe("adapter probe", () => {
  it("demo is connected, manual and grok-build are not", () => {
    assert.equal(demoAdapter.probe().connected, true);
    assert.equal(manualAdapter.probe().connected, false);
    assert.equal(grokBuildAdapter.probe().connected, false);
    assert.match(grokBuildAdapter.probe().reason ?? "", /Keine unterstützte lokale Schnittstelle/);
  });

  it("grok-build does not invent a plan", () => {
    assert.throws(
      () => grokBuildAdapter.createPlan({} as never, { id: (p) => p }),
      /Nicht verbunden/,
    );
  });
});

describe("grok-build session", () => {
  it("stays disconnected, never writes, and cannot skip the gate", () => {
    const session = createSession({ adapter: "grok-build", ids: testIds() });
    assert.equal(session.view().connected, false);
    assert.match(session.view().connectionLabel, /Nicht verbunden/);
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("weiss");
    assert.match(session.view().atomText, /Nicht verbunden/);
    assert.equal(session.snapshot().phase, "review_intent");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
    session.signal("weiss");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });
});

describe("plan before execute", () => {
  it("demo still plans before any write", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    assert.equal(session.snapshot().plan, null);
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
    session.signal("weiss");
    assert.ok(session.snapshot().plan);
    assert.equal(session.snapshot().phase, "review_plan");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
    session.signal("weiss");
    assert.notEqual(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });
});
