import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LISTEN_POLICY, probeSpeech, speechNotice } from "./speech.ts";

describe("speech policy", () => {
  it("does not listen continuously or claim to be local", () => {
    assert.equal(LISTEN_POLICY.continuous, false);
    assert.equal(LISTEN_POLICY.storesAudio, false);
    assert.equal(LISTEN_POLICY.treatAsLocal, false);
  });

  it("does not call the browser API local", () => {
    const notice = speechNotice(true);
    assert.match(notice, /nur solange du drückst/);
    assert.match(notice, /keine lokale Erkennung/);
    assert.match(notice, /speichert kein Audio/);
    assert.doesNotMatch(notice, /läuft lokal|bleibt auf dem Gerät/);
  });

  it("tells keyboard-only users that the circle still works", () => {
    assert.match(speechNotice(false), /Tastatur reicht/);
  });

  it("probe in Node has no mic and does not pretend otherwise", () => {
    const probe = probeSpeech();
    assert.equal(probe.listen, false);
    assert.equal(probe.localListen, false);
    assert.equal(probe.speak, false);
  });
});
