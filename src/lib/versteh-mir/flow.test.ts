import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  acceptAgentTranslation,
  acceptExplain,
  acceptWish,
  applySignal,
  createState,
  handleFieldSubmit,
  literalSpiegel,
  markReleased,
} from "./daemon.ts";
import { pickOneTerm } from "./terms.ts";

const WISH = "Prüfe erst, ob du mich verstanden hast, bevor Grok Build baut.";
const SPIEGEL =
  "Du willst, dass Versteh-Mir zuerst nur prüft, ob dein Wunsch verstanden wurde, und erst danach Grok Build etwas bauen lässt. Stimmt das?";

describe("signal circle", () => {
  it("a wish becomes exactly one Spiegel-Satz", () => {
    const state = acceptWish(createState(true), WISH, SPIEGEL);
    assert.equal(state.phase, "awaiting_signal");
    assert.equal(state.draftSpec, SPIEGEL);
    assert.equal(state.currentText, SPIEGEL);
    assert.equal(state.pendingSignal, "warten");
  });

  it("weiß does not send before the signal, and only then asks the adapter", () => {
    const idle = acceptWish(createState(true), WISH, SPIEGEL);
    assert.notEqual(idle.pendingSignal, "weiss");
    const { state, effect } = applySignal(idle, "weiss");
    assert.equal(state.pendingSignal, "weiss");
    assert.equal(effect.type, "send_spec");
    if (effect.type === "send_spec") {
      assert.equal(effect.spec, SPIEGEL);
    }
  });

  it("unsicher asks one question and does not send", () => {
    const idle = acceptWish(createState(true), WISH, SPIEGEL);
    const { effect } = applySignal(idle, "unsicher");
    assert.equal(effect.type, "clarify");
  });

  it("gar nichts explains exactly one word and waits", () => {
    const idle = acceptWish(createState(true), WISH, SPIEGEL);
    const { state, effect } = applySignal(idle, "gar_nichts");
    assert.equal(effect.type, "explain");
    if (effect.type !== "explain") throw new Error("expected explain");
    assert.equal(effect.term.split(/\s+/).length, 1);
    const explained = acceptExplain(
      state,
      effect.term,
      `»${effect.term}« meint hier nur diesen einen Begriff.`,
    );
    assert.equal(explained.lastExplainedTerm, effect.term);
    assert.equal(explained.pendingSignal, "warten");
    assert.equal(explained.phase, "awaiting_signal");
    const again = applySignal(explained, "gar_nichts");
    assert.equal(again.effect.type, "explain");
    if (again.effect.type === "explain") {
      assert.notEqual(again.effect.term.toLowerCase(), effect.term.toLowerCase());
    }
  });

  it("unclear input is not weiß", () => {
    const idle = acceptWish(createState(true), WISH, SPIEGEL);
    const { state, effect } = handleFieldSubmit(idle, "weiß ich nicht");
    assert.equal(effect.type, "ask_which");
    assert.equal(state.pendingSignal, "warten");
    assert.match(state.currentText, /weiß, unsicher oder gar nichts/i);
  });

  it("adapter is not invoked on unsicher or gar nichts", () => {
    const idle = acceptWish(createState(false), WISH, SPIEGEL);
    assert.equal(applySignal(idle, "unsicher").effect.type, "clarify");
    assert.equal(applySignal(idle, "gar_nichts").effect.type, "explain");
    const sent = applySignal(idle, "weiss");
    assert.equal(sent.effect.type, "send_spec");
  });

  it("second weiß after the translated reply releases, and still writes nothing", () => {
    const idle = acceptWish(createState(true), WISH, SPIEGEL);
    const afterSend = acceptAgentTranslation(
      idle,
      "Grok Build würde jetzt nur die Verständnis-Prüfung bauen, noch keinen Code.",
    );
    assert.equal(afterSend.phase, "awaiting_reply_signal");
    assert.equal(afterSend.lane, "ki_mensch");
    const { effect } = applySignal(afterSend, "weiss");
    assert.equal(effect.type, "release");
    const released = markReleased(afterSend);
    assert.equal(released.phase, "released");
    assert.match(released.currentText, /nichts geschrieben/i);
  });

  it("KI → Mensch weiß does not send a spec", () => {
    const translated = acceptWish(
      createState(true),
      "Implement the daemon state machine in src/versteh_mir/daemon.py",
      "Die KI würde die Zustandsmaschine bauen. Stimmt das?",
      "ki_mensch",
    );
    assert.equal(translated.lane, "ki_mensch");
    const { effect } = applySignal(translated, "weiss");
    assert.equal(effect.type, "release");
  });
});

describe("literalSpiegel", () => {
  it("repeats the wish in one sentence without inventing extras", () => {
    const text = literalSpiegel("Mach ein Fenster.");
    assert.equal(
      text,
      "Du willst, dass Folgendes passiert: Mach ein Fenster. Stimmt das?",
    );
  });
});

describe("pickOneTerm", () => {
  it("returns a single unused content word", () => {
    const first = pickOneTerm(SPIEGEL, []);
    assert.ok(first);
    assert.equal(first.split(/\s+/).length, 1);
    const second = pickOneTerm(SPIEGEL, [first]);
    assert.ok(second);
    assert.notEqual(second.toLowerCase(), first.toLowerCase());
  });
});
