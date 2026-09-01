import { useEffect, useId, useRef, useState } from "react";
import { ArrowUp, Mic, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSession, type View } from "@/lib/versteh-mir/session";
import { probeSpeech, speak, startListening, stopSpeaking } from "@/lib/versteh-mir/speech";
import type { Channel, Signal } from "@/lib/versteh-mir/types";

const SIGNALS: { id: Signal; label: string }[] = [
  { id: "weiss", label: "weiß" },
  { id: "unsicher", label: "unsicher" },
  { id: "gar_nichts", label: "gar nichts" },
];

function placeholder(view: View): string {
  if (view.awaiting === "signal") return "weiß, unsicher oder gar nichts";
  if (view.awaiting === "term") return "Welches Wort?";
  if (view.awaiting === "free_answer") return "Deine Antwort";
  return "Wunsch, Problem oder ein Wort";
}

export function VerstehMirWindow() {
  const fieldId = useId();
  const liveId = useId();
  const sessionRef = useRef<ReturnType<typeof createSession> | null>(null);
  if (!sessionRef.current) sessionRef.current = createSession({ adapter: "demo" });
  const session = sessionRef.current;

  const [view, setView] = useState<View>(() => session.view());
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const [privacy, setPrivacy] = useState("");
  const stopListen = useRef<(() => void) | null>(null);
  const pendingSpeech = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spoken = useRef("");

  useEffect(() => {
    const probe = probeSpeech();
    setMicAvailable(probe.listen);
    setPrivacy(probe.notice);
    return () => {
      stopListen.current?.();
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!voiceOn) return;
    if (!view.atomText || view.atomText === spoken.current) return;
    spoken.current = view.atomText;
    speak(view.atomText, true);
  }, [view.atomText, voiceOn]);

  function submitText(raw: string, channel: Channel = "keyboard") {
    const text = raw.trim();
    if (!text) return;
    setDraft("");
    setView(session.submit(text, channel));
  }

  function onSignal(signal: Signal) {
    if (!view.signalsEnabled) return;
    setView(session.signal(signal, "button"));
  }

  function startPtt(event: React.PointerEvent<HTMLButtonElement>) {
    if (listening) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    stopSpeaking();
    pendingSpeech.current = "";
    setListening(true);
    stopListen.current = startListening(
      (said) => {
        pendingSpeech.current = said;
        setDraft(said);
      },
      () => {
        setListening(false);
        stopListen.current = null;
        const said = pendingSpeech.current.trim();
        pendingSpeech.current = "";
        if (said) submitText(said, "speech");
      },
    );
  }

  function endPtt(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    stopListen.current?.();
    stopListen.current = null;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-desk px-4 py-8 text-ink">
      <section
        className="flex w-full max-w-md flex-col bg-surface shadow-window"
        style={{ borderRadius: "var(--radius-window)" }}
        aria-labelledby="vm-title"
      >
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div className="min-w-0">
            <p id="vm-title" className="font-display text-lg font-semibold tracking-tight text-balance">
              Versteh-Mir
            </p>
            <p className="mt-1 text-sm text-muted">{view.stageLabel}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  view.connected ? "bg-sage" : "bg-line-strong",
                )}
                aria-hidden="true"
              />
              <span>{view.connectionLabel}</span>
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-inner text-muted transition-[background-color,transform,color] duration-150 ease-out hover:bg-paper hover:text-ink active:scale-[0.96]"
            aria-pressed={voiceOn}
            aria-label={voiceOn ? "Vorlesen aus, Wiedergabe stoppen" : "Vorlesen an"}
            onClick={() => {
              setVoiceOn((v) => {
                if (v) stopSpeaking();
                return !v;
              });
            }}
          >
            {voiceOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
        </header>

        <div className="px-5">
          <div className="h-px bg-line" />
        </div>

        <div className="px-5 py-6">
          <p
            id={liveId}
            aria-live="polite"
            className="min-h-32 text-xl font-normal leading-snug text-pretty text-ink"
          >
            {view.atomText}
          </p>
        </div>

        <div className="px-5">
          <div className="h-px bg-line" />
        </div>

        <fieldset
          className="grid grid-cols-1 gap-2 px-5 pt-4 sm:grid-cols-3"
          disabled={!view.signalsEnabled}
        >
          <legend className="sr-only">Drei Signale</legend>
          {SIGNALS.map((signal) => {
            const primary = signal.id === "weiss";
            return (
              <button
                key={signal.id}
                type="button"
                onClick={() => onSignal(signal.id)}
                className={cn(
                  "min-h-12 rounded-inner px-3 text-sm font-bold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] disabled:opacity-40",
                  primary
                    ? "bg-ink text-surface hover:bg-ink/90"
                    : "bg-paper text-ink hover:bg-paper/80",
                )}
              >
                {signal.label}
              </button>
            );
          })}
        </fieldset>

        <form
          className="flex items-center gap-2 px-5 pt-3 pb-5"
          onSubmit={(event) => {
            event.preventDefault();
            submitText(draft, "keyboard");
          }}
        >
          {micAvailable ? (
            <button
              type="button"
              onPointerDown={startPtt}
              onPointerUp={endPtt}
              onPointerCancel={endPtt}
              aria-pressed={listening}
              aria-label={listening ? "Mikrofon an, loslassen beendet" : "Mikrofon gedrückt halten"}
              className={cn(
                "inline-flex size-12 shrink-0 items-center justify-center rounded-inner transition-[background-color,color,transform] duration-150 ease-out",
                listening ? "bg-sage text-surface" : "bg-paper text-ink hover:bg-paper/80",
              )}
            >
              <Mic className="size-5" />
            </button>
          ) : null}
          <label htmlFor={fieldId} className="sr-only">
            Wunsch oder Antwort
          </label>
          <input
            ref={inputRef}
            id={fieldId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoComplete="off"
            autoCapitalize="sentences"
            spellCheck
            placeholder={placeholder(view)}
            className="h-12 min-w-0 flex-1 rounded-inner bg-paper px-3.5 text-base text-ink outline-none ring-0 placeholder:text-muted focus-visible:shadow-[0_0_0_2px_var(--color-ink)]"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Senden"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-inner bg-ink text-surface transition-[transform,opacity] duration-150 ease-out active:scale-[0.96] disabled:opacity-40"
          >
            <ArrowUp className="size-5" />
          </button>
        </form>
      </section>

      {privacy ? (
        <p className="mt-4 max-w-md px-3 text-center text-sm text-muted text-pretty">
          {listening ? "Mikrofon an — nur solange du drückst. " : null}
          {privacy}
        </p>
      ) : null}

      {view.canStop ? (
        <div className="mt-5 flex items-center gap-5">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-muted transition-colors duration-150 hover:text-ink"
            onClick={() => {
              stopSpeaking();
              stopListen.current?.();
              setListening(false);
              setView(session.stop());
            }}
          >
            <Square className="size-3.5 fill-current" />
            Stopp
          </button>
          <button
            type="button"
            className="min-h-11 px-3 text-sm text-muted transition-colors duration-150 hover:text-ink"
            onClick={() => {
              stopSpeaking();
              stopListen.current?.();
              setListening(false);
              setDraft("");
              setView(session.reset());
              inputRef.current?.focus();
            }}
          >
            Von vorn
          </button>
        </div>
      ) : (
        <p className="mt-5 max-w-md px-3 text-center text-sm text-muted text-pretty">
          Sprache oder Tastatur. Erst weiter mit weiß. Ja, okay oder weiter zählen nicht.
        </p>
      )}
    </main>
  );
}
