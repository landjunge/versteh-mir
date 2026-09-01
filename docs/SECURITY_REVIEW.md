# Defensiver Sicherheitsreview — Etappe 6

Stand: 1. September 2026

Kein Freibrief für neue Adapter. Gegen CORE_PROTOCOL, SECURITY_MODEL und die Pflicht-Tests aus dem Bauplan.

## Was hält

- Nur **weiß** / **weiss** gibt frei. `ja`, `okay`, `passt`, `weiter`, `weiß ich nicht` nicht.
- Ein Satz, der das Wort weiß enthält, ist kein Signal.
- PlanningGrant und ApprovalGrant: Hash, Sitzung, Nonce, Ablauf, einmal.
- Broker schreibt nur bekannte Fähigkeiten auf README.md / PROJECT.md im Speicher.
- Pfade mit `/`, `..`, versteckte Namen: blockiert.
- Kritische Risiken (löschen, senden, Geheimnis, Geld) können in der Erklärung nicht verschwinden.
- Grok-Build-Adapter: `probe().connected === false`, `createPlan` wirft.
- Mikrofon: nicht dauerhaft, Audio wird nicht gespeichert, Browser-STT heißt nicht lokal.
- Vorlesen standardmäßig aus.

## Behoben in diesem Review

Sprachtranskript mit **geringer Sicherheit** (`confidence < 0.75`) wird nicht mehr automatisch abgeschickt. Es darf im Feld stehen, der Mensch sendet selbst. Pflicht-Test: „Sprachtranskript mit geringer Sicherheit gibt nicht frei.“

## Restrisiko, bewusst

| Punkt | Risiko | Umgang |
|---|---|---|
| Browser-Speech | Hersteller kann Audio sehen | Hinweis sichtbar, nicht „lokal“ |
| PTT-Loslassen sendet das Transkript | STT hört „weiß“ | nur exakter Treffer zählt; niedrige confidence nicht auto |
| Öffentliche Vorschau | jeder kann die Demo nutzen | nur Testdateien im Speicher, keine Geheimnisse |
| Kein OS-Broker | späteres echtes Verzeichnis | dieselben Pfadregeln schon jetzt |
| Grok CLI auf dem Mac | `grok -p` umginge das Gate | Versteh-Mir startet grok nicht |
| Kein Threat Model für Signatur | Desktop-Paket | nicht gebaut, siehe DESKTOP.md |

## Prompt Injection

Gelesener Dateiinhalt und Agententext können das Wort „weiß“ enthalten. Sie erzeugen keinen `human_signal`. Nur Tastatur, Taste oder angenommenes Transkript des Menschen, und nur als exaktes Signal.

## Entscheidung Adapter

Keine weiteren Adapter nach diesem Review. Die fünf Mensch-Tests aus ALPHA.md stehen noch aus. Erst danach.
