import type { Signal } from "./types.ts";

export function normalizeInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!?…,;:]+$/g, "")
    .trim();
}

const WEISS = new Set(["weiß", "weiss"]);
const UNSICHER = new Set(["unsicher", "unklar"]);
const GAR_NICHTS = new Set(["gar nichts", "garnichts"]);
const STOP = new Set(["stopp", "stop", "abbrechen", "halt"]);
const RESET = new Set(["von vorn", "von vorne", "neu starten", "zurücksetzen"]);
const IDK = new Set([
  "ich weiß es nicht",
  "ich weiss es nicht",
  "weiß es nicht",
  "weiss es nicht",
  "weiß nicht",
  "weiss nicht",
  "keine ahnung",
  "ich weiß nicht",
  "ich weiss nicht",
]);

/** Release signal: only weiß / weiss. Never ja, okay, passt, weiter, or "weiß ich nicht". */
export function parseSignal(raw: string): Signal | null {
  const t = normalizeInput(raw);
  if (!t) return null;
  if (t === "weiß ich nicht" || t === "weiss ich nicht") return null;
  if (WEISS.has(t)) return "weiss";
  if (UNSICHER.has(t)) return "unsicher";
  if (GAR_NICHTS.has(t)) return "gar_nichts";
  return null;
}

export function parseGarNichtsTerm(raw: string): string | null {
  const match = raw
    .trim()
    .match(/^(?:was heißt|was heisst|erklär|erklaer|erkläre)\s+(.+)/i);
  if (!match?.[1]) return null;
  const word = oneWord(match[1]);
  return word || null;
}

export function isExplainBare(raw: string): boolean {
  const t = normalizeInput(raw);
  return (
    t === "erklär" ||
    t === "erklaer" ||
    t === "erkläre" ||
    t === "erklaere" ||
    t === "was heißt" ||
    t === "was heisst"
  );
}

export function isStopPhrase(raw: string): boolean {
  return STOP.has(normalizeInput(raw));
}

export function isResetPhrase(raw: string): boolean {
  return RESET.has(normalizeInput(raw));
}

export function isIDontKnow(raw: string): boolean {
  return IDK.has(normalizeInput(raw));
}

export function oneWord(text: string): string {
  const match = text.trim().match(/[A-Za-zÄÖÜäöüß]+/);
  return match?.[0] ?? "";
}

export function oneSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim().replace(/^[-*•]\s*/, "");
  if (!cleaned) return "";
  const match = cleaned.match(/^[\s\S]*?[.!?]/);
  return (match?.[0] ?? cleaned).trim();
}

export const SIGNAL_PROMPT = "weiß, unsicher oder gar nichts?";
export const TERM_PROMPT = "Welches Wort oder welcher Teil ist gerade nicht verständlich?";
