# Versteh-Mir – Brainstorm-Zusammenfassung

## Ziel
Eine App, die zwischen Mensch und KI-Agenten (z. B. Grok Build, Cursor, OpenCode) sitzt und Missverständnisse verhindert, bevor Code gebaut wird.

## Kernidee
Der Translator ist ein lokaler Daemon. Er fängt Agent-Aufrufe ab und übersetzt in beide Richtungen:
- Mensch → KI: vage Eingaben werden zu prüfbaren Spezifikationen.
- KI → Mensch: dichte Antworten werden in die Sprache des Users zurückgelegt.

## Eingaben
Sprache ist die Standard-Eingabe (Barrierefreiheit: Legastheniker, motorische Einschränkungen), aber nicht die einzige. Auch Tastatur und weitere Möglichkeiten sind möglich. Der User merkt nicht, welcher Weg gewählt wurde.

## Verständnis-Prüfung (drei Signale)
Bevor irgendwas gebaut wird, prüft der Translator, ob der User wirklich verstanden hat:
- **weiß** → weiter
- **unsicher** → fragt nach dem konkreten Punkt
- **gar nichts** → erklärt ein Wort, wartet auf nächstes Signal

Nie raten, nie blind weiterbauen.

## Oberfläche
Kein Dashboard. Nur ein kleines Fenster oder Terminal-Panel:
- Statuszeile oben: „Verbunden mit [Agent]" (z. B. grün für Grok Build).
- Aktuelle Frage oder Spezifikation, hörbar oder als Text.
- Bestätigung per Sprache oder Taste.

## Technik (erste Etappe)
- Daemon im Hintergrund.
- Ein Adapter pro Agent (zunächst Grok Build).
- Frage-Stufe zuerst.
- Kein eigener API-Schlüssel nötig: nutzt bestehende Session des Users.
- Später: Feedback-Schleife (Korrekturen werden gemerkt) und weitere Adapter.

## Name & Repo
- Name: **Versteh-Mir**
- Repo: https://github.com/landjunge/versteh-mir

## Nächster Schritt
Einen konkreten Bauplan für Daemon + Adapter + Frage-Stufe schreiben.