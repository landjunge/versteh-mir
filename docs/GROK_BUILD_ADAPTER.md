# Grok-Build-Adapter — Nachweis

Stand: 31. August 2026

Etappe 4 verlangt zuerst den Nachweis einer offiziell unterstützten lokalen oder sitzungsgebundenen Schnittstelle. Ohne Nachweis darf der Adapter nicht „verbunden“ heißen.

## Geprüft

| Weg | Offiziell? | In dieser App nutzbar? |
|---|---|---|
| Grok-Build-CLI `grok` (TUI / `grok -p`) | ja, [docs.x.ai/build](https://docs.x.ai/build/overview) | nein — `grok` ist hier nicht installiert |
| Agent Client Protocol (ACP) | ja, für andere Apps, die die CLI einbinden | nein — kein ACP-Host, kein lokaler Grok-Prozess |
| xAI-API (`grok-4.6`, `XAI_API_KEY`) | ja als Modell-API | nein als Grok Build — der Bauplan untersagt, ein allgemeines Modell als Grok Build auszugeben |
| Bestehende Grok-Build-Sitzung (Web/Sandbox) | nicht dokumentiert | nein — kein Anhängen an `GROK_SESSION_ID`, kein Session-Scraping |

Nicht genutzt, weil verboten oder unehrlich:

- Cookies oder Sitzungstoken lesen
- Browser-Automation gegen die Grok-Oberfläche
- Systemtext „Du bist Grok Build“ an die xAI-API
- versteckte Schlüsselabfrage

## Ergebnis

**Keine unterstützte Schnittstelle in dieser Laufzeit.**

Der Adapter `grok-build` bleibt:

- sichtbar **Nicht verbunden**
- `createPlan` wirft, statt zu raten
- keine Dateiänderung, kein Netz durch diesen Adapter

`probe().connected === false` ist der nachweisbare Status.

## Was stattdessen geht

1. **Demo** — verbunden, nur Testbereich, zwei Gates, Capability Broker.
2. **Manual** — nicht verbunden. Nach Gate 1 zeigt Versteh-Mir den Wunsch zum Kopieren. Der Mensch gibt ihn selbst an Grok Build weiter. Rückweg: eingefügter Plan, erneut weiß, dann Broker.

Der Grundbetrieb braucht keinen API-Schlüssel.

## Wann Grok Build verbunden werden darf

Erst wenn alle Punkte gelten:

1. Eine von xAI dokumentierte lokale oder sitzungsgebundene Schnittstelle (CLI/ACP oder Nachfolger) ist in der Laufzeit wirklich vorhanden.
2. `probe()` kann das ohne Raten prüfen.
3. Planen und Ausführen laufen getrennt durch den Capability Broker.
4. Der Mensch sieht denselben Status, den `probe()` liefert.

Bis dahin bleibt die Anzeige **Nicht verbunden**.
