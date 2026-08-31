import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isIDontKnow,
  parseGarNichtsTerm,
  parseSignal,
} from "./signals.ts";

describe("parseSignal", () => {
  it("accepts only weiß and weiss as release", () => {
    assert.equal(parseSignal("weiß"), "weiss");
    assert.equal(parseSignal("Weiss!"), "weiss");
    assert.equal(parseSignal("unsicher"), "unsicher");
    assert.equal(parseSignal("unklar"), "unsicher");
    assert.equal(parseSignal("gar nichts"), "gar_nichts");
  });

  it("never treats ja, okay, passt, weiter or weiß ich nicht as weiß", () => {
    assert.equal(parseSignal("ja"), null);
    assert.equal(parseSignal("okay"), null);
    assert.equal(parseSignal("ok"), null);
    assert.equal(parseSignal("passt"), null);
    assert.equal(parseSignal("weiter"), null);
    assert.equal(parseSignal("weiß ich nicht"), null);
    assert.equal(parseSignal("weiss ich nicht"), null);
    assert.equal(parseSignal("vielleicht"), null);
    assert.equal(parseSignal("ok mach mal"), null);
    assert.equal(parseSignal(""), null);
  });
});

describe("parseGarNichtsTerm", () => {
  it("takes the named word after was heißt", () => {
    assert.equal(parseGarNichtsTerm("was heißt Spezifikation"), "Spezifikation");
    assert.equal(parseGarNichtsTerm("erklär Adapter bitte"), "Adapter");
    assert.equal(parseGarNichtsTerm("gar nichts"), null);
  });
});

describe("isIDontKnow", () => {
  it("accepts ich weiß es nicht", () => {
    assert.equal(isIDontKnow("Ich weiß es nicht."), true);
    assert.equal(isIDontKnow("weiß"), false);
  });
});
