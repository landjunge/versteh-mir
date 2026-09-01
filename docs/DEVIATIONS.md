# Abweichungen zwischen Code, CORE_PROTOCOL.md und BUILD_PLAN.md

Stand: 1. September 2026

## Bewusst so gebaut

1. **Laufzeit.** Dieser Stand läuft als Web-App im App-Builder, nicht als eigener Loopback-Daemon mit zufälligem Port. Dieselbe Zustandsmaschine, dieselben Gates. Kein separates Node-Daemon-Paket und kein pnpm-Lock, weil die Umgebung npm + TanStack Start vorgibt.
2. **Adapter.** Standard ist der ehrliche Demo-Adapter (`Verbunden mit Demo`). Grok Build bleibt `Nicht verbunden`: in dieser Laufzeit gibt es keine CLI/ACP-Schnittstelle, und die xAI-API ist kein Grok Build. Nachweis: [GROK_BUILD_ADAPTER.md](GROK_BUILD_ADAPTER.md). Manual bleibt der Weg zum Kopieren.
3. **Capability Broker.** Speicher-Testbereich mit README.md und PROJECT.md. Grants, Hash, Einmaligkeit, Ablauf, Sitzung und Pfadregeln werden erzwungen. Kein OS-Verzeichnis, deshalb keine echten Symlink-Angriffe — dieselben Pfadstrings werden trotzdem abgewiesen.
4. **Bedeutung.** Deterministischer Offline-Fallback, synchron, ohne Modell. Orientierung liegt in der Zustandsmaschine; das Bedeutungsmodul erklärt und prüft Pläne. Kritische Folgen kommen aus den Operationen, nicht aus Agentenprosa.
5. **Signale.** `ja`, `okay`, `passt`, `weiter` sind keine Freigabe mehr. Das widerspricht dem historischen PLAN.md und den alten Alias-Tests, folgt aber CORE_PROTOCOL.md.
6. **Sprache (Etappe 5).** Push-to-talk im Fenster, Tastatur bleibt vollständig. Browser-Erkennung wird nicht lokal genannt. Kein Tauri-Paket in dieser Laufzeit: [DESKTOP.md](DESKTOP.md).

## Noch offen (nicht in diesem Stand)

- Echte Grok-Build-Schnittstelle, sobald CLI/ACP in der Laufzeit nachweisbar ist
- Signiertes Tauri-Desktop-Paket (erst nach Threat Model, siehe DESKTOP.md)
- Optionales „Wie kamen wir hierher?“
