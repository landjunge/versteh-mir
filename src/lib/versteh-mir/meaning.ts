import type { OpeningKind } from "./types.ts";
import { normalizeInput } from "./signals.ts";

const SKIP_STARTERS = new Set([
  "Ein",
  "Eine",
  "Einen",
  "Einer",
  "Einem",
  "Der",
  "Die",
  "Das",
  "Dem",
  "Den",
  "Des",
  "Ich",
  "Du",
  "Wir",
  "Ihr",
  "Sie",
  "Was",
  "Wie",
  "Wo",
  "Wann",
  "Warum",
  "Welches",
  "Welcher",
  "Welche",
  "Mein",
  "Meine",
  "Kein",
  "Keine",
  "Nicht",
  "Aber",
  "Und",
  "Oder",
  "Mit",
  "Für",
  "Auf",
  "Aus",
  "Bei",
  "Nach",
  "Von",
  "Zum",
  "Zur",
  "Im",
  "In",
  "Am",
  "Ändere",
  "Ändern",
  "Bitte",
]);

export function extractGermanNouns(text: string): string[] {
  const words = text.match(/[A-Za-zÄÖÜäöüß]{2,}/g) ?? [];
  const out: string[] = [];
  const seen = new Set<string>();
  words.forEach((w, i) => {
    if (SKIP_STARTERS.has(w)) return;
    const isAllCaps = w.length >= 2 && w === w.toUpperCase() && /[A-Z]/.test(w);
    const first = w[0] ?? "";
    const isCapitalized = first === first.toUpperCase() && first !== first.toLowerCase();
    if (i === 0 && !isAllCaps) return;
    if (isAllCaps || isCapitalized) {
      const key = w.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(w);
      }
    }
  });
  return out;
}

export function classifyOpening(text: string): OpeningKind {
  const t = normalizeInput(text);
  if (
    t === "gar nichts" ||
    t === "ich verstehe gar nichts" ||
    t === "verstehe nichts" ||
    t === "ich verstehe nichts" ||
    t === "ich kann nicht folgen" ||
    t === "ich kann gerade nicht mehr folgen"
  ) {
    return "cannot_follow";
  }
  if (
    /kein(en)? plan/.test(t) ||
    /(weiß|weiss) nicht mehr/.test(t) ||
    /wo ich anfangen/.test(t) ||
    (/(weiß|weiss) nicht/.test(t) && /wichtig/.test(t))
  ) {
    return "no_plan";
  }
  const nouns = extractGermanNouns(text);
  const hasWie = /\bwie\b/i.test(text);
  const speculative = /\b(könnte|koennte|vielleicht|später|spaeter|irgendwann)\b/i.test(t);
  if (nouns.length >= 2 && (hasWie || speculative)) return "explore";
  return "clear_intent";
}

export function mirrorNoPlan(text: string): string {
  if (/projekt/i.test(text)) {
    return "Du weißt gerade noch nicht, was bei deinem Projekt als Nächstes wichtig ist, möchtest aber nicht einfach blind weitermachen. Stimmt das?";
  }
  return "Du weißt gerade noch nicht, welcher Weg richtig ist, möchtest aber nicht einfach blind weitermachen. Stimmt das?";
}

export function orientQuestion(text: string): string {
  if (/projekt/i.test(text)) {
    return "Woran merkst du bei deinem Projekt, dass es gerade nicht weitergeht?";
  }
  return "Woran merkst du, dass es gerade nicht weitergeht?";
}

export function orientReadOffer(): string {
  return "Das ist in Ordnung. Soll ich zuerst nur den aktuellen Stand ansehen und noch nichts verändern?";
}

export function orientReadIntent(): string {
  return "Du willst noch keine Lösung auswählen; ich soll zunächst nur den freigegebenen Bereich lesen und dir genau eine mögliche nächste Richtung erklären. Stimmt das?";
}

export function relationQuestion(from: string, to: string): string {
  return `Was ist für dich bei ${from} und ${to} gleich?`;
}

export function mirrorRelation(from: string, to: string, relation: string): string {
  const body = relation.trim().replace(/[.!?]+$/g, "");
  return `Für dich sind ${from} und ${to} so verbunden: ${body}. Das ist deine Aussage, keine Bewertung. Stimmt das?`;
}

export function exploreIntentSummary(from: string, to: string, relation: string): string {
  const body = relation.trim().replace(/[.!?]+$/g, "");
  return `Du willst die Verbindung von ${from} und ${to} so festhalten: ${body}. Noch nichts daran bauen. Stimmt das?`;
}

export function mirrorClearIntent(text: string): {
  summary: string;
  unresolved: string[];
  target: string | null;
  constraints: string[];
} {
  const t = text.trim();
  const unresolved: string[] = [];
  const constraints: string[] = [];
  let target: string | null = null;
  if (/readme/i.test(t)) target = "README.md";
  if (/sonst nichts|nur den|sonst nichts/i.test(t)) {
    constraints.push("sonst nichts ändern");
  }
  if (/projektsatz/i.test(t) && !/lauten|ersetzen durch|ändern in\s+[„"]/i.test(t)) {
    unresolved.push("wie der neue Projektsatz lauten soll");
  }
  let summary: string;
  if (target && /projektsatz/i.test(t)) {
    summary = unresolved.length
      ? `Du willst in der README nur den Projektsatz ändern und sonst nichts. Noch offen: ${unresolved[0]}. Stimmt das?`
      : `Du willst in der README nur den Projektsatz ändern und sonst nichts. Stimmt das?`;
  } else {
    const body = t.replace(/[.!?]+$/g, "");
    summary = unresolved.length
      ? `Du willst, dass Folgendes passiert: ${body}. Noch offen: ${unresolved[0]}. Stimmt das?`
      : `Du willst, dass Folgendes passiert: ${body}. Stimmt das?`;
  }
  return { summary, unresolved, target, constraints };
}

const GLOSSARY: Record<string, string> = {
  spezifikation: "Eine Spezifikation ist die kurze, prüfbare Fassung deines Wunsches.",
  adapter: "Ein Adapter ist die Verbindung zu einer bestimmten KI. Hier ist das die Demo.",
  gate: "Ein Gate ist eine Stelle, an der du mit weiß genau einen benannten Schritt erlaubst.",
  plan: "Ein Plan ist die Liste dessen, was die KI tun würde — noch bevor etwas passiert.",
  demo: "Demo ist ein Übungs-Adapter. Er ändert nur Dateien in einem Testbereich.",
  projektsatz: "Der Projektsatz ist der kurze Satz, der sagt, worum es in dem Projekt geht.",
  readme: "README ist die Datei, die ein Projekt in einem Satz erklärt.",
  tresor: "Ein Tresor ist hier das Wort, das du selbst benutzt hast — noch ohne festgelegte Technik.",
  container: "Ein Container ist hier das Wort, das du selbst benutzt hast — noch ohne festgelegte Technik.",
  identität: "Identität meint hier nur das Wort aus deinem Satz, nicht eine fertige Lösung.",
  frei: "Freigabe heißt: du erlaubst genau den gezeigten Schritt, nichts darüber hinaus.",
  freigabe: "Freigabe heißt: du erlaubst genau den gezeigten Schritt, nichts darüber hinaus.",
};

export function explainTerm(term: string): string {
  const key = term.toLowerCase();
  if (GLOSSARY[key]) return GLOSSARY[key];
  return `»${term}« meint hier nur dieses eine Wort aus dem gerade gezeigten Satz.`;
}

export function explainTermAsExample(term: string): string {
  const key = term.toLowerCase();
  if (key === "projektsatz") {
    return "Beispiel: In einer README steht oft ein Satz wie „Das ist ein Übersetzer zwischen Mensch und KI.“ Genau so ein Satz wäre der Projektsatz.";
  }
  if (key === "tresor") {
    return "Beispiel: Manche Menschen meinen mit Tresor einen sicheren Ort für etwas Wichtiges — wie einen geschlossenen Behälter.";
  }
  return `Ein anderes Bild: Stell dir »${term}« als das eine Stück vor, das in dem Satz vorkommt — nicht als fertige Technik.`;
}

export function readOrientationResult(): string {
  return "Im Testbereich steht noch kein nächster Schritt fest. Eine mögliche Richtung: zuerst nur den Projektsatz in der README klären. Sonst wurde nichts verändert.";
}
