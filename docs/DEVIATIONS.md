# Abweichungen zwischen Code, CORE_PROTOCOL.md und BUILD_PLAN.md

Stand: 31. August 2026

## Bewusst so gebaut

1. **Laufzeit.** Dieser Stand läuft als Web-App im App-Builder, nicht als eigener Loopback-Daemon mit zufälligem Port. Dieselbe Zustandsmaschine, dieselben Gates. Kein separates Node-Daemon-Paket und kein pnpm-Lock, weil die Umgebung npm + TanStack Start vorgibt.
2. **Adapter.** Standard ist der ehrliche Demo-Adapter (`Verbunden mit Demo`). Grok Build bleibt `Nicht verbunden` — keine vorgetäuschte Session, kein allgemeines Modell als Grok Build.
3. **Capability Broker.** Ein Speicher-Testbereich mit README.md und PROJECT.md. Das reicht, um Gate 1 (nur lesen/planen) und Gate 2 (einmalig schreiben) zu prüfen. Kein SECURITY_MODEL.md, keine Symlink-Tests, keine Shell — das ist Etappe 2.
4. **Bedeutung.** Deterministischer Offline-Fallback. Kein xAI-Aufruf im Grundbetrieb, damit nichts geraten und kein Schlüssel verlangt wird.
5. **Signale.** `ja`, `okay`, `passt`, `weiter` sind keine Freigabe mehr. Das widerspricht dem historischen PLAN.md und den alten Alias-Tests, folgt aber CORE_PROTOCOL.md.

## Noch offen (nicht in diesem Stand)

- Echte Grok-Build-Schnittstelle (Etappe 4)
- Desktop-Verpackung / Tauri (Etappe 5)
- Vollständiger Capability Broker nach Etappe 2
- Optionales „Wie kamen wir hierher?“
