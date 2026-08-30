# Versteh-Mir – Idee

## Ziel
Versteh-Mir ist ein Translator zwischen Mensch und KI-Agenten (z. B. Grok Build, Cursor CLI, OpenCode).
Er sitzt als Daemon zwischen dir und dem Agenten und regelt alles per Sprache (oder Tastatur).

## Kern-Idee
Kein Blindflug mehr. Bevor irgendwas gebaut wird, prüft der Translator, ob er dich wirklich verstanden hat.

## Die drei Signale
Du antwortest immer mit einem von drei Signalen:
- **weiß** – weiter
- **unsicher** – nach dem konkreten Punkt fragen
- **gar nichts** – ein Wort erklären, eine Ebene tiefer gehen

## Ablauf
1. Du sprichst oder tippst deinen Wunsch.
2. Der Translator spiegelt zurück, was er verstanden hat.
3. Du signalisierst: weiß / unsicher / gar nichts.
4. Bei „unsicher“ fragt er gezielt nach.
5. Bei „gar nichts“ erklärt er nur ein Wort und wartet.
6. Erst wenn du bestätigst, geht es an den Agenten.
7. Die Antwort des Agenten wird zurückübersetzt, bevor irgendwas geschrieben wird.

## Oberfläche
- Kleines Fenster oder Statuszeile im Terminal.
- Oben: „Verbunden mit …“ (z. B. Grok Build).
- Kein Dashboard, nur die aktuelle Frage oder Spezifikation.

## Technik (erste Etappe)
- Daemon im Hintergrund.
- Ein Adapter für Grok Build.
- Verständnis-Prüfung zuerst.
- Kein eigener API-Schlüssel nötig – nutzt deine bestehende Session.

## Name
Versteh-Mir
Repo: https://github.com/landjunge/versteh-mir
