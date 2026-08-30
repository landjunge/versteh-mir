# Versteh-Mir – konkreter Bauplan (Etappe 1)

Dieses Dokument ist der Bauplan für eine andere KI.
Es beschreibt nur das, was bereits festgelegt ist.
Vorschläge stehen extra gekennzeichnet.
Nicht raten. Nicht still erweitern.

Stand: 30. August 2026
Repo: https://github.com/landjunge/versteh-mir
Verwandte Dateien: `docs/IDEA.md`, `docs/BRAINSTORM.md`

---

## 1. Was gebaut wird

Versteh-Mir sitzt als lokaler Daemon zwischen Mensch und KI-Agent.
Es übersetzt in beide Richtungen und darf erst bauen, wenn der Mensch bestätigt hat, dass er verstanden wurde.

- Mensch → Agent: vager Wunsch wird zu einer prüfbaren Spezifikation.
- Agent → Mensch: dichte Agent-Antwort wird in die Sprache des Users zurückgelegt.
- Gate: drei Signale, bevor irgendetwas an den Agenten geht oder geschrieben wird.

Erste Etappe hat genau ein Ziel:
**Frage-Stufe + kleines Fenster + ein Adapter-Anschluss für Grok Build.**

---

## 2. Festgelegt (nicht verhandeln)

1. Name: **Versteh-Mir**
2. Repo: `landjunge/versteh-mir`
3. Lokal zuerst. Daemon im Hintergrund.
4. Sprache ist Standard-Eingabe. Tastatur ist erlaubt. Der Weg ist für den User unsichtbar.
5. Drei Signale, sonst nichts:
   - **weiß** = weiter
   - **unsicher** = nach dem konkreten Punkt fragen
   - **gar nichts** = ein Wort erklären, eine Ebene tiefer, dann warten
6. Kein Dashboard. Keine Einstellungen-Wüste.
7. Oberfläche: kleines Fenster oder Terminal-Statuszeile.
   Oben: `Verbunden mit …` (z. B. Grok Build).
   Darunter nur die aktuelle Frage oder Spezifikation.
8. Kein eigener API-Schlüssel. Bestehende Session des Users nutzen.
9. Nie raten. Nie blind weiterbauen.
10. Nie lange Erklärungen auf einmal. Immer eine Ebene, ein Wort, ein Begriff.
11. Erster Adapter: Grok Build. Cursor und OpenCode kommen später.
12. Barrierefreiheit ist Kern, nicht Extra (u. a. Legasthenie, motorische Einschränkungen).

---

## 3. Ausgeschlossen (nicht bauen)

- Fertiges Multi-Agent-Produkt, zweites Orchestrator-Dashboard, Gnom-Hub-Kopie.
- Eigenes Konto / eigenen API-Key verlangen.
- Prompt-Optimizer, Humanizer, reine Einweg-Klarstellung ohne Rückweg.
- Settings-App mit Dutzenden Schaltern.
- Autopilot: Agent schreibt Dateien, bevor Signal **weiß** kam.
- Lange Tutorials, Onboarding-Wizard, Marketing-Seite als Etappe 1.
- Cursor-Adapter, OpenCode-Adapter, Domain-Setup, Store-Release.
- Raten bei Unsicherheit. Lücken füllen. „Ich denke, du meintest …“ ohne Nachfrage.

Wenn etwas hier nicht steht, gehört es nicht in Etappe 1.

---

## 4. Nutzerfluss (verbindlich)

```
Wunsch (Sprache oder Tastatur)
        ↓
Translator spiegelt in einem Satz, was er verstanden hat
        ↓
User-Signal:
  weiß        → Spezifikation gilt, Adapter darf an den Agenten
  unsicher    → eine gezielte Frage zum unklaren Punkt, dann wieder Signal
  gar nichts  → genau ein Wort / ein Begriff erklären, dann warten
        ↓
Erst nach weiß: Auftrag an den verbundenen Agenten
        ↓
Antwort des Agenten zurückübersetzen
        ↓
Wieder Signal, bevor etwas geschrieben oder ausgeführt wird
```

Regeln für den Spiegel-Satz:

- Ein Satz, keine Liste, keine technische Fachsprache ohne Übersetzung.
- Enthält: Absicht, betroffenes Ziel, was als Nächstes passieren würde.
- Enthält nicht: Implementation, Dateinamen-Lawine, alternative Architekturen.

Beispiel:

> Du willst, dass Versteh-Mir zuerst nur prüft, ob dein Wunsch verstanden wurde, und erst danach Grok Build etwas bauen lässt. Stimmt das?

---

## 5. Architektur Etappe 1

Drei Teile, nicht mehr.

```
[kleines Fenster / Statuszeile]
        ↕
[Daemon: Verstehen + Signale + Spezifikation]
        ↕
[Adapter: Grok Build]
```

### 5.1 Daemon

Aufgaben:

- Eingabe entgegennehmen (Sprache oder Text, gleiche interne Form).
- Spiegel-Satz erzeugen.
- Signal lesen (`weiß` / `unsicher` / `gar nichts`).
- Zustand halten: aktuell offene Frage, aktuelle Spezifikation, verbundenes Ziel.
- Erst nach `weiß` den Adapter aufrufen.
- Agent-Antwort in einen kurzen Mensch-Satz zurücklegen.

Zustand ist klein und lokal:

- `connected_agent` (zuerst immer `grok-build`)
- `draft_spec` (letzter Spiegel-Satz)
- `pending_signal` (wartet / weiß / unsicher / gar nichts)
- `last_explained_term` (nur bei „gar nichts“)

Kein Cloud-Backend. Keine Datenbank. Datei oder Speicher reicht.

### 5.2 Oberfläche

Minimal:

- Eine Zeile Status: `Verbunden mit Grok Build` oder `Nicht verbunden`.
- Ein Feld für den aktuellen Spiegel-Satz / die aktuelle Frage.
- Drei klare Antworten: weiß, unsicher, gar nichts.
- Sprache und Tastatur landen im selben Feld.

Nicht:

- Tabs, Projektliste, Theme-Schalter, Log-Viewer, Multi-Chat.

### 5.3 Adapter Grok Build

Etappe 1 braucht keinen perfekten Hook in Grok Build.

Pflicht in Etappe 1:

- Adapter-Schnittstelle: `send_spec(spec) -> agent_reply`
- Eine echte oder nachvollziehbare Verbindung zur bestehenden Grok-Session, ohne neuen Key.
- Wenn die Session fehlt: klar sagen `Nicht verbunden`, nicht heimlich einen Key verlangen.

Vorschlag, nicht festgelegt: zuerst Adapter als klarer Stub mit festem Vertrag, dann die echte Session-Anbindung als zweiten Schritt innerhalb derselben Etappe, sobald der Signal-Kreis steht.

Nicht in Etappe 1: Cursor, OpenCode, beliebige CLI-Wrapper-Sammlung.

---

## 6. Signal-Vertrag

Interne Werte, fest:

| Signal        | Bedeutung                         | Nächste Aktion                                      |
|---------------|-----------------------------------|-----------------------------------------------------|
| `weiss`       | verstanden, weiter                | Spec an Adapter                                     |
| `unsicher`    | ein Punkt ist unklar              | eine Frage zu genau diesem Punkt                    |
| `gar_nichts`  | Begriff nicht verstanden          | ein Wort erklären, dann auf nächstes Signal warten  |

Eingabe-Aliase (Sprache und Tastatur):

- weiß / weiss / weiter / ja / passt
- unsicher / unklar / warte / das nicht
- gar nichts / nichts / was heißt / erklär

Bei unklarer Eingabe: nicht raten. Kurz nachfragen: „weiß, unsicher oder gar nichts?“

---

## 7. Vorschlag Technik (nicht festgelegt)

Nur damit eine andere KI nicht im Leeren steht. Darf ersetzt werden, wenn es lokal, einfach und ohne Extra-Key bleibt.

- Sprache der App-Logik: Python 3 (lokal, ein Prozess).
- Mini-UI: Terminal-Panel zuerst (am schnellsten prüfbar). Optionales kleines Fenster danach.
- Spracheingabe / Sprachausgabe: vorhandene Systemstimme des Rechners, kein eigener Cloud-STT-Key.
- Spezifikation und Verlauf: eine lokale Datei unter dem User-Verzeichnis, keine Cloud.

Wenn dieser Vorschlag kollidiert mit „keine neuen Keys / lokal zuerst“, gewinnt die Regel, nicht der Vorschlag.

---

## 8. Repo-Struktur Etappe 1

Neu anzulegen, sobald gebaut wird (noch nicht in diesem Commit, außer dieser Plan-Datei):

```
versteh-mir/
  README.md
  docs/
    IDEA.md
    BRAINSTORM.md
    PLAN.md          ← diese Datei
  src/versteh_mir/
    daemon.py        # Zustand, Spiegel, Signale
    signals.py       # Vertrag der drei Signale
    ui_terminal.py   # Statuszeile + aktuelle Frage
    adapters/
      base.py        # send_spec Vertrag
      grok_build.py  # erster Adapter
  tests/
    test_signals.py
    test_flow.py
```

Kein Monorepo, kein zweites Produkt, kein Plugin-Markt.

---

## 9. Reihenfolge der Arbeit

Nicht parallel alles. In dieser Reihenfolge:

1. Signal-Vertrag und Zustandsobjekt (ohne UI, ohne Agent).
2. Terminal-Kreis: Wunsch → Spiegel → Signal → nächster Spiegel.
3. Regel „gar nichts erklärt nur ein Wort“ hart prüfen.
4. Regel „Adapter erst nach weiß“ hart prüfen.
5. Adapter-Vertrag + Grok-Build-Anbindung oder ehrlicher Stub mit `Nicht verbunden`.
6. Rückübersetzung der Agent-Antwort, wieder durch die drei Signale.
7. Erst dann: kleines Fenster statt nur Terminal.

Fertig ist Etappe 1, wenn ein Mensch ohne Handbuch diesen Kreis einmal durchsprechen kann.

---

## 10. Abnahme Etappe 1

Etappe 1 ist erst fertig, wenn alle Punkte wahr sind:

- [ ] App startet lokal, ohne API-Key-Abfrage.
- [ ] Status zeigt verbunden oder nicht verbunden, kein dritter Zustand ohne Text.
- [ ] Ein gesprochener oder getippter Wunsch erzeugt genau einen Spiegel-Satz.
- [ ] `weiß` lässt den Adapter erst danach los.
- [ ] `unsicher` stellt genau eine Nachfrage, baut nichts.
- [ ] `gar nichts` erklärt genau ein Wort und wartet.
- [ ] Unklare Antwort wird nicht als `weiß` gewertet.
- [ ] Kein Dashboard, keine Settings-Seite, kein zweiter Agent.
- [ ] Tests decken den Signal-Kreis ab.

---

## 11. Offen, später

Nicht jetzt bauen, nur merken:

- Feedback-Schleife: Korrekturen merken.
- Weitere Adapter (Cursor, OpenCode).
- Domain `versteh-mir.de` (Verfügbarkeit hier nicht geprüft).
- Kleines Fenster statt Terminal.
- Persistente Spezifikations-Dateien je Aufgabe.

---

## 12. Anweisung an die nächste KI

Lies zuerst `docs/IDEA.md`, dann `docs/BRAINSTORM.md`, dann diese Datei.

Bau nur Etappe 1.
Erfinde keine Features.
Wenn etwas unklar ist: stoppen und nachfragen, nicht füllen.
Wenn du unsicher bist, sag unsicher.
Wenn du ein Wort nicht belegen kannst, sag das.

Nächster konkreter Schritt nach diesem Dokument:
Signal-Kreis in `src/versteh_mir/` mit Tests, noch ohne Grok-Build-Magie.
