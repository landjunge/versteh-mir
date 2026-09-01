# Desktop — Etappe 5

Stand: 1. September 2026

## Was hier wirklich läuft

Versteh-Mir läuft als eine Web-App in dieser Umgebung. Es gibt **keinen** zweiten Daemon-Prozess und **kein** signiertes Tauri-Paket.

Lokal auf dem Mac:

- Browser-Fenster (Vorschau)
- Terminal: `npm run cli`
- Zsh: `versteh-mir`

Spracheingabe gibt es nur im Browser, und nur solange die Taste gedrückt ist. Die CLI ist Tastatur.

## Warum kein Tauri-Build in diesem Stand

1. Die Laufzeit ist der App-Builder, nicht ein Desktop-Toolkit mit Rust.
2. Signierte Veröffentlichung kommt laut Bauplan **erst nach** einem Threat Model.
3. Ein unsigniertes `.dmg` / `.app` vorzutäuschen wäre unehrlich.

## Geplantes Desktop-Paket (nicht gebaut)

Wenn später ein eigenes Paket entsteht, gilt:

- ein Prozess: Fenster zu → Sitzung tot, Grants weg
- Bindung nur an Loopback, falls wieder ein lokaler Server nötig wird
- Push-to-talk, kein Dauermikrofon
- Browser-Speech niemals „lokal“ nennen, bis ein lokaler Adapter nachweisbar ist
- Signatur und Notarisierung erst nach der Sicherheitsprüfung in SECURITY_MODEL.md

Bis dahin ist der sichere lokale Weg die CLI plus Manual-Adapter.
