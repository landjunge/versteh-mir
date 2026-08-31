# Versteh-Mir

> Nicht besser prompten. Erst dasselbe meinen.

Versteh-Mir ist eine Verständigungs- und Einwilligungsschicht zwischen Mensch und KI. Sie zeigt in Alltagssprache, was verstanden wurde und was als Nächstes passieren würde. Erst nach **weiß** darf geplant werden. Erst nach einem zweiten **weiß** darf der unveränderte Plan einmalig ausgeführt werden.

`ja`, `okay` und `weiter` zählen nicht.

## Drei Signale

- **weiß** — genau das gezeigte Stück stimmt; nur der benannte nächste Schritt
- **unsicher** — eine Frage zu diesem Punkt, nichts wird getan
- **gar nichts** — ein benanntes Wort erklären oder eine Ebene zurück

## Was dieser Stand kann

- Vier Ausgangslagen in derselben Fläche: klarer Wunsch, kein Plan, ungewöhnliche Verbindung, „gar nichts“
- Demo-Adapter mit Test-Dateien, ohne API-Schlüssel
- Grok Build: **Nicht verbunden** — keine vorgetäuschte Sitzung
- Zwei Gates: Bedeutung, dann Handlung
- Capability Broker: ohne ausgestellte Freigabe, mit altem Hash, nach Ablauf oder beim zweiten Versuch wird nichts geschrieben
- Planwirkung aus den Operationen: Löschen, Senden, Geheimnisse und Kosten können in der Erklärung nicht verschwinden

## Dokumentation

- [Core Protocol](docs/CORE_PROTOCOL.md)
- [Bauplan](docs/BUILD_PLAN.md)
- [Sicherheitsmodell](docs/SECURITY_MODEL.md)
- [Abweichungen](docs/DEVIATIONS.md)
- [TypeScript](docs/TYPESCRIPT.md)
- [Grok-Build-Adapter](docs/GROK_BUILD_ADAPTER.md)

Repo: https://github.com/landjunge/versteh-mir

## Terminal auf dem Mac

Node 22, im geklonten Ordner:

```
npm install
npm run cli
```

Grok Build (`curl -fsSL https://x.ai/cli/install.sh | bash`) ist getrennt. Versteh-Mir führt es nicht aus.

