# Abweichungen zwischen Code, CORE_PROTOCOL.md und BUILD_PLAN.md

Stand: 31. August 2026

## Bewusst so gebaut

1. **Laufzeit.** Dieser Stand läuft als Web-App im App-Builder, nicht als eigener Loopback-Daemon mit zufälligem Port. Dieselbe Zustandsmaschine, dieselben Gates. Kein separates Node-Daemon-Paket und kein pnpm-Lock, weil die Umgebung npm + TanStack Start vorgibt.
2. **Adapter.** Standard ist der ehrliche Demo-Adapter (`Verbunden mit Demo`). Grok Build bleibt `Nicht verbunden` — keine vorgetäuschte Session, kein allgemeines Modell als Grok Build.
3. **Capability Broker.** Speicher-Testbereich mit README.md und PROJECT.md. Grants, Hash, Einmaligkeit, Ablauf, Sitzung und Pfadregeln werden erzwungen. Kein OS-Verzeichnis, deshalb keine echten Symlink-Angriffe — dieselben Pfadstrings werden trotzdem abgewiesen.
4. **Bedeutung.** Deterministischer Offline-Fallback, synchron, ohne Modell. Der Vertrag aus dem Bauplan ist erfüllt; fehlende Angaben bleiben in `unresolved`. Kritische Folgen (löschen, senden, Geheimnisse, Kosten) kommen aus den Operationen, nicht aus Agentenprosa.
5. **Signale.** `ja`, `okay`, `passt`, `weiter` sind keine Freigabe mehr. Das widerspricht dem historischen PLAN.md und den alten Alias-Tests, folgt aber CORE_PROTOCOL.md.

## Noch offen (nicht in diesem Stand)

- Echte Grok-Build-Schnittstelle (Etappe 4)
- Desktop-Verpackung / Tauri (Etappe 5)
- Optionales „Wie kamen wir hierher?“
