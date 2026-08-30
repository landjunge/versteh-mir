import { createServerFn } from "@tanstack/react-start";
import { oneSentence, parseTranslate } from "./signals.ts";

type ChatResult = { ok: true; text: string } | { ok: false; error: string };

const SYSTEM = [
  "Du bist Versteh-Mir, ein Translator zwischen Mensch und KI-Agent.",
  "Nie raten. Nie Lücken füllen. Nie 'ich denke, du meintest'.",
  "Immer nur eine Ebene, ein Wort, ein Begriff, ein Satz.",
  "Kein Listenformat. Keine Dateinamen. Keine alternative Architektur.",
  "Kurzes, klares Deutsch.",
].join(" ");

async function chat(
  user: string,
  maxTokens: number,
): Promise<ChatResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false, error: "Nicht verbunden" };

  const body = JSON.stringify({
    model: "grok-4.5",
    temperature: 0.2,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: user },
    ],
  });

  const run = () =>
    fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

  let res = await run();
  if (!res.ok) {
    res = await run();
  }
  if (!res.ok) {
    return { ok: false, error: "Nicht verbunden" };
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) return { ok: false, error: "Nicht verbunden" };
  return { ok: true, text };
}

export const getConnection = createServerFn({ method: "GET" }).handler(async () => {
  return {
    connected: Boolean(process.env.XAI_API_KEY),
    agent: "grok-build" as const,
  };
});

export const makeSpiegel = createServerFn({ method: "POST" })
  .validator((input: { wish: string }) => input)
  .handler(async ({ data }): Promise<ChatResult> => {
    const wish = data.wish.trim();
    if (!wish) return { ok: false, error: "Kein Wunsch." };
    const result = await chat(
      [
        "Der Mensch hat diesen Wunsch:",
        `"""${wish}"""`,
        "",
        "Spiegle in GENAU EINEM Satz zurück, was du verstanden hast.",
        "Der Satz enthält: Absicht, betroffenes Ziel, was als Nächstes passieren würde.",
        "Ende mit: Stimmt das?",
      ].join("\n"),
      180,
    );
    if (!result.ok) return result;
    let sentence = oneSentence(result.text);
    if (!/[?]$/.test(sentence)) {
      sentence = `${sentence.replace(/[.!]+$/g, "")}. Stimmt das?`;
    }
    return { ok: true, text: sentence };
  });

export const translateEntry = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => input)
  .handler(async ({ data }): Promise<
    | { ok: true; direction: "mensch_ki" | "ki_mensch"; text: string }
    | { ok: false; error: string }
  > => {
    const text = data.text.trim();
    if (!text) return { ok: false, error: "Kein Text." };
    const result = await chat(
      [
        "Translator in beide Richtungen. Nicht raten, nichts erfinden.",
        "Text:",
        `"""${text}"""`,
        "",
        "Fall mensch_ki: Das ist Mensch-Sprache (Wunsch, Absicht, Alltag).",
        "Spiegle in GENAU EINEM Satz als prüfbare Spezifikation. Ende mit: Stimmt das?",
        "",
        "Fall ki_mensch: Das ist Agent-/KI-Sprache (dicht, technisch, Bau-Plan).",
        "Lege in GENAU EINEN einfachen Mensch-Satz. Ende mit: Stimmt das?",
        "",
        "Wenn beides möglich ist: mensch_ki. Nie Lücken füllen.",
        "",
        "Antwort GENAU in zwei Zeilen:",
        "RICHTUNG: mensch_ki",
        "SATZ: ...",
      ].join("\n"),
      200,
    );
    if (!result.ok) return result;
    const parsed = parseTranslate(result.text);
    if (!parsed) {
      let sentence = oneSentence(result.text);
      if (!sentence) return { ok: false, error: "Nicht verbunden" };
      if (!/[?]$/.test(sentence)) {
        sentence = `${sentence.replace(/[.!]+$/g, "")}. Stimmt das?`;
      }
      return { ok: true, direction: "mensch_ki", text: sentence };
    }
    let sentence = parsed.sentence;
    if (!/[?]$/.test(sentence)) {
      sentence = `${sentence.replace(/[.!]+$/g, "")}. Stimmt das?`;
    }
    return { ok: true, direction: parsed.direction, text: sentence };
  });

export const askOne = createServerFn({ method: "POST" })
  .validator((input: { wish: string; spec: string }) => input)
  .handler(async ({ data }): Promise<ChatResult> => {
    const result = await chat(
      [
        `Wunsch: ${data.wish}`,
        `Letzter Spiegel: ${data.spec}`,
        "",
        "Der Mensch ist unsicher.",
        "Stelle GENAU EINE gezielte Frage zu dem unklarsten Punkt.",
        "Keine Liste. Keine Optionen erfinden. Eine Frage.",
      ].join("\n"),
      120,
    );
    if (!result.ok) return result;
    return { ok: true, text: oneSentence(result.text) };
  });

export const explainOne = createServerFn({ method: "POST" })
  .validator((input: { spec: string; term: string }) => input)
  .handler(async ({ data }): Promise<ChatResult> => {
    const term = data.term.trim();
    const result = await chat(
      [
        `Aktueller Text: ${data.spec}`,
        `Erkläre nur das Wort »${term}« in EINEM kurzen Satz.`,
        "Eine Ebene tiefer. Nicht den ganzen Text wiederholen.",
        "Kein zweites Wort.",
      ].join("\n"),
      100,
    );
    if (!result.ok) {
      return {
        ok: true,
        text: `»${term}« — ich kann das Wort gerade nicht erklären, weil ich nicht verbunden bin.`,
      };
    }
    return { ok: true, text: `»${term}« — ${oneSentence(result.text)}` };
  });

export const forwardSpec = createServerFn({ method: "POST" })
  .validator((input: { spec: string }) => input)
  .handler(async ({ data }): Promise<ChatResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Nicht verbunden" };

    const agent = await chat(
      [
        "Du bist Grok Build. Der Mensch hat diese Spezifikation bestätigt:",
        `"""${data.spec}"""`,
        "",
        "Sage in wenigen Sätzen, was du als Nächstes tun würdest.",
        "Noch nicht bauen. Kein Code. Keine Dateiliste.",
      ].join("\n"),
      220,
    );
    if (!agent.ok) return agent;

    const translated = await chat(
      [
        "Dichte Agent-Antwort:",
        `"""${agent.text}"""`,
        "",
        "Lege das in GENAU EINEN einfachen deutschen Satz für den Menschen.",
        "Was würde jetzt passieren, in seiner Sprache.",
      ].join("\n"),
      140,
    );
    if (!translated.ok) {
      return { ok: true, text: oneSentence(agent.text) };
    }
    return { ok: true, text: oneSentence(translated.text) };
  });
