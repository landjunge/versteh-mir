# Versteh-Mir

> Nicht besser prompten. Erst dasselbe meinen.

Versteh-Mir ist eine lokale Verständigungs- und Einwilligungsschicht zwischen Mensch und KI-Agent. Sie zeigt dem Menschen in seiner Sprache, was die KI verstanden hat und was sie als Nächstes tun will. Erst nach einer eindeutigen Freigabe darf der bestätigte Schritt stattfinden.

Sprache oder Tastatur. Drei Signale: **weiß**, **unsicher**, **gar nichts**.

Zwei Richtungen:

- **Mensch → KI** — ein Wunsch wird zu einer Bedeutung, die der Mensch prüfen kann.
- **KI → Mensch** — ein Agentenplan wird mit seinen tatsächlichen Folgen verständlich erklärt.

Das Ziel sind zwei getrennte Gates: Das erste **weiß** bestätigt die Bedeutung und erlaubt nur das Planen. Das zweite **weiß** gibt genau den unveränderten, sichtbaren Plan einmalig frei.

## Aktueller Stand

Das Repository enthält einen frühen TypeScript-/React-Prototyp. Der Signal-Kreis und erste Tests sind vorhanden; ein technisch erzwungenes Handlungstor und eine echte Grok-Build-Anbindung sind noch nicht fertig.

Quellcode:

- src/lib/versteh-mir/ — bisheriger Kern, Signale und Tests
- src/components/versteh-mir/window.tsx — das kleine Fenster

## Dokumentation

- [Idee](docs/IDEA.md)
- [Brainstorm](docs/BRAINSTORM.md)
- [Erster Bauplan für Etappe 1](docs/PLAN.md)
- [Verbindlicher Bauplan für die weitere Umsetzung](docs/BUILD_PLAN.md)

Repo: https://github.com/landjunge/versteh-mir
