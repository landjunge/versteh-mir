type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function recognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canListen(): boolean {
  return recognitionCtor() !== null;
}

export function startListening(onText: (text: string) => void, onStop: () => void): () => void {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    onStop();
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = "de-DE";
  rec.continuous = false;
  rec.interimResults = false;
  rec.onresult = (event) => {
    const said = event.results[0]?.[0]?.transcript?.trim() ?? "";
    if (said) onText(said);
  };
  rec.onerror = () => onStop();
  rec.onend = () => onStop();
  try {
    rec.start();
  } catch {
    onStop();
  }
  return () => {
    try {
      rec.stop();
    } catch {
      /* already stopped */
    }
  };
}

export function speak(text: string, enabled: boolean): void {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "de-DE";
  utter.rate = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const de = voices.find((v) => v.lang.toLowerCase().startsWith("de"));
  if (de) utter.voice = de;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
