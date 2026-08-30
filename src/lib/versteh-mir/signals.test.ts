import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  oneSentence,
  oneWord,
  parseGarNichtsTerm,
  parseSignal,
  parseTranslate,
} from "./signals.ts";

describe("parseSignal", () => {
  it("maps every alias exactly", () => {
    assert.equal(parseSignal("weiß"), "weiss");
    assert.equal(parseSignal("Weiss!"), "weiss");
    assert.equal(parseSignal("weiter"), "weiss");
    assert.equal(parseSignal("ja"), "weiss");
    assert.equal(parseSignal("passt"), "weiss");
    assert.equal(parseSignal("unsicher"), "unsicher");
    assert.equal(parseSignal("unklar"), "unsicher");
    assert.equal(parseSignal("warte"), "unsicher");
    assert.equal(parseSignal("das nicht"), "unsicher");
    assert.equal(parseSignal("gar nichts"), "gar_nichts");
    assert.equal(parseSignal("nichts"), "gar_nichts");
    assert.equal(parseSignal("erklär"), "gar_nichts");
  });

  it("does not treat unclear talk as weiß", () => {
    assert.equal(parseSignal("weiß ich nicht"), null);
    assert.equal(parseSignal("vielleicht"), null);
    assert.equal(parseSignal("ok mach mal"), null);
    assert.equal(parseSignal("ja bitte weiter so"), null);
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

describe("oneSentence / oneWord", () => {
  it("keeps a single sentence and a single word", () => {
    assert.equal(oneSentence("Eins. Zwei. Drei."), "Eins.");
    assert.equal(oneWord("Spezifikation und mehr"), "Spezifikation");
  });
});

describe("parseTranslate", () => {
  it("reads both directions from the two-line contract", () => {
    const mensch = parseTranslate(
      "RICHTUNG: mensch_ki\nSATZ: Du willst ein kleines Fenster. Stimmt das?",
    );
    assert.equal(mensch?.direction, "mensch_ki");
    assert.equal(mensch?.sentence, "Du willst ein kleines Fenster.");

    const ki = parseTranslate(
      "RICHTUNG: ki_mensch\nSATZ: Die KI würde zuerst nur prüfen, nicht bauen. Stimmt das?",
    );
    assert.equal(ki?.direction, "ki_mensch");
    assert.match(ki?.sentence ?? "", /prüfen/);
  });

  it("does not invent a direction when the contract is missing", () => {
    assert.equal(parseTranslate("Du willst ein Fenster."), null);
  });
});
