import { useEffect, useId, useRef, useState } from "react";
import { ArrowUp, Mic, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  askOne,
  explainOne,
  forwardSpec,
  getConnection,
  translateEntry,
} from "@/lib/versteh-mir/api";
import {
  acceptAdapterFailure,
  acceptAgentTranslation,
  acceptClarify,
  acceptExplain,
  acceptWish,
  applySignal,
  createState,
  handleFieldSubmit,
  literalSpiegel,
  markReleased,
  reset,
  setConnected,
  type DaemonState,
  type Effect,
  type Signal,
} from "@/lib/versteh-mir/daemon";
import { canListen, speak, startListening, stopSpeaking } from "@/lib/versteh-mir/speech";
import { DIRECTION_LABEL } from "@/lib/versteh-mir/signals";

const SIGNALS: { id: Signal; label: string }[] = [
  { id: "weiss", label: "weiß" },
  { id: "unsicher", label: "unsicher" },
  { id: "gar_nichts", label: "gar nichts" },
];

export function VerstehMirWindow() {
  const fieldId = useId();
  const liveId = useId();
  const [state, setState] = useState<DaemonState>(() => createState(false));
  const [checking, setChecking] = useState(true);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [micAvailable, setMicAvailable] = useState(false);
  const stopListen = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spoken = useRef("");

  useEffect(() => {
    setMicAvailable(canListen());
    let alive = true;
    void getConnection().then((info) => {
      if (!alive) return;
      setState((s) => setConnected(s, info.connected));
      setChecking(false);
    });
    return () => {
      alive = false;
      stopListen.current?.();
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!state.currentText || state.currentText === spoken.current) return;
    spoken.current = state.currentText;
    speak(state.currentText, voiceOn);
  }, [state.currentText, voiceOn]);

  async function runEffect(base: DaemonState, effect: Effect) {
    if (effect.type === "none" || effect.type === "ask_which") return;
    if (effect.type === "release") {
      const next = markReleased(base);
      setState(next);
      return;
    }

    setBusy(true);
    try {
      if (effect.type === "clarify") {
        const source = base.draftSpec || base.currentText;
        if (!base.connected) {
          setState(
            acceptClarify(base, "Welcher Punkt ist unklar?"),
          );
          return;
        }
        const result = await askOne({ data: { wish: base.wish, spec: source } });
        setState(
          acceptClarify(
            base,
            result.ok ? result.text : "Welcher Punkt ist unklar?",
          ),
        );
        return;
      }

      if (effect.type === "explain") {
        const source =
          base.phase === "awaiting_reply_signal"
            ? base.translatedReply || base.currentText
            : base.draftSpec || base.currentText;
        if (!base.connected) {
          setState(
            acceptExplain(
              base,
              effect.term,
              `»${effect.term}« — ich kann das Wort gerade nicht erklären, weil ich nicht verbunden bin.`,
            ),
          );
          return;
        }
        const result = await explainOne({
          data: { spec: source, term: effect.term },
        });
        setState(
          acceptExplain(
            base,
            effect.term,
            result.ok
              ? result.text
              : `»${effect.term}« — ich kann das Wort gerade nicht erklären.`,
          ),
        );
        return;
      }

      if (effect.type === "send_spec") {
        if (!base.connected) {
          setState(acceptAdapterFailure(base, "Nicht verbunden. Der Auftrag ist nicht gegangen."));
          return;
        }
        const result = await forwardSpec({ data: { spec: effect.spec } });
        if (!result.ok) {
          setState(acceptAdapterFailure(base, result.error));
          return;
        }
        setState(acceptAgentTranslation(base, result.text));
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitText(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setDraft("");

    const result = handleFieldSubmit(state, text);
    if (result.wish) {
      setBusy(true);
      try {
        let spiegel = literalSpiegel(result.wish);
        let lane: "mensch_ki" | "ki_mensch" = "mensch_ki";
        if (state.connected) {
          const translated = await translateEntry({ data: { text: result.wish } });
          if (translated.ok) {
            spiegel = translated.text;
            lane = translated.direction;
          }
        }
        const next = acceptWish(state, result.wish, spiegel, lane);
        setState(next);
      } finally {
        setBusy(false);
      }
      return;
    }

    setState(result.state);
    await runEffect(result.state, result.effect);
  }

  async function onSignal(signal: Signal) {
    if (busy || state.phase === "listen" || state.phase === "released") return;
    const { state: next, effect } = applySignal(state, signal);
    setState(next);
    await runEffect(next, effect);
  }

  function toggleMic() {
    if (listening) {
      stopListen.current?.();
      stopListen.current = null;
      setListening(false);
      return;
    }
    setListening(true);
    stopListen.current = startListening(
      (said) => {
        setDraft(said);
        void submitText(said);
      },
      () => {
        setListening(false);
        stopListen.current = null;
      },
    );
  }

  const awaiting =
    state.phase === "awaiting_signal" || state.phase === "awaiting_reply_signal";
  const statusLabel = checking
    ? "Verbindung wird geprüft"
    : state.connected
      ? "Verbunden mit Grok Build"
      : "Nicht verbunden";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-desk px-4 py-8 text-ink">
      <section
        className="flex w-full max-w-md flex-col bg-surface shadow-[var(--shadow-window)]"
        style={{ borderRadius: "var(--radius-window)" }}
        aria-labelledby="vm-title"
      >
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div className="min-w-0">
            <p id="vm-title" className="text-sm font-bold tracking-tight">
              Versteh-Mir
            </p>
            <p className="mt-0.5 text-sm text-muted">Mensch ↔ KI</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  checking
                    ? "bg-muted"
                    : state.connected
                      ? "bg-sage"
                      : "bg-line-strong",
                )}
                aria-hidden="true"
              />
              <span>{statusLabel}</span>
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[var(--radius-inner)] text-muted transition-[background-color,transform,color] duration-150 ease-[var(--ease-out)] hover:bg-paper hover:text-ink active:scale-[0.96]"
            aria-pressed={voiceOn}
            aria-label={voiceOn ? "Stimme aus" : "Stimme an"}
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
          {state.lane ? (
            <p className="mb-3 text-sm font-bold text-muted">{DIRECTION_LABEL[state.lane]}</p>
          ) : null}
          <p
            id={liveId}
            aria-live="polite"
            className="min-h-32 text-xl font-normal leading-snug text-pretty text-ink"
          >
            {state.currentText}
          </p>
          {busy ? (
            <p className="mt-3 text-sm text-muted" aria-live="polite">
              Einen Moment.
            </p>
          ) : null}
        </div>

        <div className="px-5">
          <div className="h-px bg-line" />
        </div>

        <fieldset className="grid grid-cols-1 gap-2 px-5 pt-4 sm:grid-cols-3" disabled={!awaiting || busy}>
          <legend className="sr-only">Drei Signale</legend>
          {SIGNALS.map((signal) => {
            const primary = signal.id === "weiss";
            const selected = state.pendingSignal === signal.id;
            return (
              <button
                key={signal.id}
                type="button"
                onClick={() => void onSignal(signal.id)}
                className={cn(
                  "min-h-12 rounded-[var(--radius-inner)] px-3 text-sm font-bold transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out)] active:scale-[0.96] disabled:opacity-40",
                  primary
                    ? "bg-ink text-surface hover:bg-ink/90"
                    : "bg-paper text-ink hover:bg-paper/80",
                  selected && !primary && "shadow-[0_0_0_2px_var(--color-ink)]",
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
            void submitText(draft);
          }}
        >
          {micAvailable ? (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              aria-label={listening ? "Spracheingabe stoppen" : "Spracheingabe"}
              className={cn(
                "inline-flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-inner)] transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96]",
                listening ? "bg-sage text-surface" : "bg-paper text-ink hover:bg-paper/80",
              )}
            >
              <Mic className="size-5" />
            </button>
          ) : null}
          <label htmlFor={fieldId} className="sr-only">
            Wunsch oder KI-Text
          </label>
          <input
            ref={inputRef}
            id={fieldId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={busy}
            autoComplete="off"
            autoCapitalize="sentences"
            spellCheck
            placeholder={awaiting ? "weiß, unsicher oder gar nichts" : "Mensch oder KI"}
            className="h-12 min-w-0 flex-1 rounded-[var(--radius-inner)] bg-paper px-3.5 text-base text-ink outline-none ring-0 placeholder:text-muted focus-visible:shadow-[0_0_0_2px_var(--color-ink)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            aria-label="Senden"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-inner)] bg-ink text-surface transition-[transform,opacity] duration-150 ease-[var(--ease-out)] active:scale-[0.96] disabled:opacity-40"
          >
            <ArrowUp className="size-5" />
          </button>
        </form>
      </section>

      {state.phase !== "listen" ? (
        <button
          type="button"
          className="mt-5 min-h-11 px-3 text-sm text-muted transition-colors duration-150 hover:text-ink"
          onClick={() => {
            stopSpeaking();
            setDraft("");
            setState((s) => reset(s));
            inputRef.current?.focus();
          }}
        >
          Von vorn
        </button>
      ) : (
        <p className="mt-5 max-w-md px-3 text-center text-sm text-muted text-pretty">
          Sprache oder Tastatur. Mensch → KI und KI → Mensch. Erst weiter mit weiß.
        </p>
      )}
    </main>
  );
}
