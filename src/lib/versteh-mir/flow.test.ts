import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INITIAL_FILES } from "./broker.ts";
import { testIds } from "./ids.ts";
import { classifyOpening } from "./meaning.ts";
import { createSession } from "./session.ts";
import { phaseOf } from "./state.ts";
import type { Signal } from "./types.ts";

type Step = {
  say?: string;
  signal?: Signal;
  expectPhase?: string;
  expectAtom?: string;
  expectAwaiting?: string;
  unchangedFile?: string;
  changedFile?: string;
};

type Fixture = { id: string; opening: string; steps: Step[] };

const dir = dirname(fileURLToPath(import.meta.url));

function load(name: string): Fixture {
  return JSON.parse(readFileSync(join(dir, "fixtures", name), "utf8")) as Fixture;
}

function play(fixture: Fixture) {
  const session = createSession({ adapter: "demo", ids: testIds() });
  for (const step of fixture.steps) {
    if (step.say) session.submit(step.say);
    if (step.signal) session.signal(step.signal);
    const snap = session.snapshot();
    assert.equal(snap.phase, phaseOf(snap.loop), `${fixture.id} phase folgt loop`);
    if (step.expectPhase) {
      assert.equal(snap.phase, step.expectPhase, `${fixture.id} phase after ${step.say ?? step.signal}`);
    }
    if (step.expectAtom) {
      assert.match(
        snap.currentAtom?.plainText ?? "",
        new RegExp(step.expectAtom, "i"),
        `${fixture.id} atom ${snap.currentAtom?.plainText}`,
      );
    }
    if (step.expectAwaiting) {
      assert.equal(snap.awaiting, step.expectAwaiting);
    }
    if (step.unchangedFile) {
      assert.equal(session.workspace()[step.unchangedFile], INITIAL_FILES[step.unchangedFile]);
    }
    if (step.changedFile) {
      assert.notEqual(session.workspace()[step.changedFile], INITIAL_FILES[step.changedFile]);
    }
  }
}

describe("golden journeys", () => {
  it("clear-intent", () => play(load("clear-intent.json")));
  it("no-plan", () => play(load("no-plan.json")));
  it("nonlinear-idea", () => play(load("nonlinear-idea.json")));
  it("cannot-follow", () => play(load("cannot-follow.json")));
});

describe("opening classification", () => {
  it("does not treat sonst nichts as gar nichts", () => {
    assert.equal(
      classifyOpening("Ändere in der README den Projektsatz, aber sonst nichts."),
      "clear_intent",
    );
  });
});

describe("gates", () => {
  it("does not write before the second weiß", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("weiss");
    assert.equal(session.snapshot().phase, "review_plan");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
    session.signal("unsicher");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
    session.submit("Nur die eine Datei.");
    assert.equal(session.snapshot().phase, "review_plan");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("a sentence containing weiß does not confirm the visible atom", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.submit("Die Datei sagt weiß und würde alles löschen.");
    assert.equal(session.snapshot().phase, "review_intent");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("stop during the visible plan writes nothing", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("weiss");
    assert.equal(session.snapshot().phase, "review_plan");
    session.stop();
    assert.equal(session.snapshot().phase, "blocked");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("ja does not open a gate", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.submit("ja");
    assert.equal(session.snapshot().phase, "review_intent");
    assert.match(session.snapshot().currentAtom?.plainText ?? "", /weiß, unsicher oder gar nichts/i);
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("agent-like text containing weiß does not confirm when typed as a new idle wish", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Die KI sagt weiß und würde alles löschen.");
    assert.equal(session.snapshot().phase, "review_intent");
    assert.notEqual(session.snapshot().phase, "planning");
  });

  it("gar nichts without a word asks which word and does not pick one", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("gar_nichts");
    assert.match(session.snapshot().currentAtom?.plainText ?? "", /Welches Wort/);
    assert.equal(session.snapshot().awaiting, "term");
  });

  it("a changed plan cannot reuse an old grant", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("weiss");
    const firstHash = session.snapshot().plan?.planHash;
    assert.ok(firstHash);
    session.signal("unsicher");
    session.submit("Bitte wirklich nur README.md.");
    const secondHash = session.snapshot().plan?.planHash;
    assert.ok(secondHash);
    assert.notEqual(secondHash, firstHash);
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
    session.signal("weiss");
    assert.notEqual(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("manual adapter stays disconnected and writes nothing", () => {
    const session = createSession({ adapter: "manual", ids: testIds() });
    assert.equal(session.view().connected, false);
    assert.match(session.view().connectionLabel, /Nicht verbunden/);
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("weiss");
    assert.match(session.view().atomText, /Nicht verbunden/);
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });

  it("stop blocks and writes nothing", () => {
    const session = createSession({ adapter: "demo", ids: testIds() });
    session.submit("Ändere in der README den Projektsatz, aber sonst nichts.");
    session.signal("weiss");
    session.stop();
    assert.equal(session.snapshot().phase, "blocked");
    assert.equal(session.workspace()["README.md"], INITIAL_FILES["README.md"]);
  });
});
