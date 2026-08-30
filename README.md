# Versteh-Mir

Translator zwischen Mensch und KI-Agent. Sprache oder Tastatur. Drei Signale, bevor gebaut wird: **weiß**, **unsicher**, **gar nichts**.

Zwei Richtungen:

- **Mensch → KI** — Wunsch wird ein Satz, den die KI prüfen kann.
- **KI → Mensch** — dichte Agent-Antwort wird in die Sprache des Menschen gelegt.

Ohne **weiß** geht nichts weiter. Es wird in diesem Kreis nichts geschrieben.

## Etappe 1

Kleines Fenster. Ein Adapter: Grok Build. Kein Dashboard. Kein zweiter Agent. Kein extra Schlüssel.

Quellcode:

- `src/lib/versteh-mir/` — Daemon, Signale, Adapter, Tests
- `src/components/versteh-mir/window.tsx` — das Fenster

## Docs

- Idee: [docs/IDEA.md](docs/IDEA.md)
- Brainstorm: [docs/BRAINSTORM.md](docs/BRAINSTORM.md)
- Bauplan Etappe 1: [docs/PLAN.md](docs/PLAN.md)

Repo: https://github.com/landjunge/versteh-mir
