type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export const LISTEN_POLICY = {
  continuous: false,
  storesAudio: false,
  treatAsLocal: false,
  minConfidence: 0.75,
} as const;

export type SpeechProbe = {
  listen: boolean;
  speak: boolean;
  localListen: false;
  notice: string;
};

export function speechNotice(listen: boolean): string {
  if (!listen) {
    return "Keine Spracheingabe in diesem Browser. Die Tastatur reicht für den ganzen Kreis.";
  }
  return "Mikrofon nur solange du drückst. Die Erkennung läuft über den Browser und kann Sprache nach außen senden. Das ist keine lokale Erkennung. Versteh-Mir speichert kein Audio.";
}

export function probeSpeech(): SpeechProbe {
  const listen = canListen();
  const speak = typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
  return {
    listen,
    speak,
    localListen: false,
    notice: speechNotice(listen),
  };
}

function recognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function acceptTranscript(text: string, confidence?: number): string | null {
  const said = text.trim();
  if (!said) return null;
  if (typeof confidence === "number" && confidence < LISTEN_POLICY.minConfidence) return null;
  return said;
}

export function canListen(): boolean {
  return recognitionCtor() != null;
}

export function startListening(
  onText: (text: string) => void,
  onEnd: () => void,
  onUncertain?: (text: string) => void,
): () => void {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    onEnd();
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = "de-DE";
  rec.interimResults = false;
  rec.continuous = LISTEN_POLICY.continuous;
  rec.onresult = (event) => {
    const alt = event.results[0]?.[0] as { transcript?: string; confidence?: number } | undefined;
    const raw = alt?.transcript?.trim() ?? "";
    const said = acceptTranscript(raw, alt?.confidence);
    if (said) onText(said);
    else if (raw) onUncertain?.(raw);
  };
  rec.onerror = () => onEnd();
  rec.onend = () => onEnd();
  try {
    rec.start();
  } catch {
    onEnd();
  }
  return () => {
    try {
      rec.stop();
    } catch {
      /* ignore */
    }
  };
}

export function speak(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "de-DE";
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
