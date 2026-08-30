export type Signal = "weiss" | "unsicher" | "gar_nichts";

const ALIASES: Record<Signal, string[]> = {
  weiss: ["weiß", "weiss", "weiter", "ja", "passt"],
  unsicher: ["unsicher", "unklar", "warte", "das nicht"],
  gar_nichts: ["gar nichts", "nichts", "was heißt", "was heisst", "erklär", "erklaer", "erkläre"],
};

export function normalizeInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!?…,;:]+$/g, "")
    .trim();
}

/** Exact alias only. Never treat a longer utterance as a signal. */
export function parseSignal(raw: string): Signal | null {
  const t = normalizeInput(raw);
  if (!t) return null;

  let hit: Signal | null = null;
  for (const signal of Object.keys(ALIASES) as Signal[]) {
    if (ALIASES[signal].includes(t)) {
      if (hit) return null;
      hit = signal;
    }
  }
  return hit;
}

export function parseGarNichtsTerm(raw: string): string | null {
  const match = raw
    .trim()
    .match(/^(?:was heißt|was heisst|erklär|erklaer|erkläre)\s+(.+)/i);
  if (!match?.[1]) return null;
  const word = oneWord(match[1]);
  return word || null;
}

export function oneWord(text: string): string {
  const match = text.trim().match(/[A-Za-zÄÖÜäöüß]+/);
  return match?.[0] ?? "";
}

export function oneSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim().replace(/^[-*•]\s*/, "");
  if (!cleaned) return "";
  const match = cleaned.match(/^[\s\S]*?[.!?]/);
  const sentence = (match?.[0] ?? cleaned).trim();
  return sentence;
}

export const SIGNAL_PROMPT = "weiß, unsicher oder gar nichts?";

export type Direction = "mensch_ki" | "ki_mensch";

export const DIRECTION_LABEL: Record<Direction, string> = {
  mensch_ki: "Mensch → KI",
  ki_mensch: "KI → Mensch",
};

export function parseTranslate(raw: string): { direction: Direction; sentence: string } | null {
  const dir = raw.match(/RICHTUNG:\s*(mensch_ki|ki_mensch)/i);
  if (!dir?.[1]) return null;
  const satz = raw.match(/SATZ:\s*([\s\S]+)/i);
  const sentence = oneSentence((satz?.[1] ?? "").trim());
  if (!sentence) return null;
  return {
    direction: dir[1].toLowerCase() as Direction,
    sentence,
  };
}

