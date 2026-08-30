# Versteh-Mir – Core Protocol

Version: 0.1  
Stand: 30. August 2026  
Status: verbindliche Produktspezifikation für Verhalten und Nutzerfluss

Dieses Dokument führt Orientierung, ungewöhnliche Denkwege, Verständigungsprüfung und Handlungsfreigabe in einem einzigen Protokoll zusammen.

Für das Verhalten des Produkts ist dieses Dokument maßgeblich. docs/BUILD_PLAN.md beschreibt die technische Umsetzung und Reihenfolge. docs/IDEA.md, docs/BRAINSTORM.md und docs/PLAN.md dokumentieren die Entstehung.

## 1. Ein Satz

> Versteh-Mir beginnt bei dem, was ein einzelner Mensch gerade ausdrücken kann, bewahrt seine eigenen Gedanken, baut mit ihm bestätigte Bedeutung auf und lässt eine KI erst dann exakt das tun, dessen Folgen dieser Mensch verstanden und freigegeben hat.

Kurzform:

> Nicht besser prompten. Erst dasselbe meinen.

## 2. Ein Produkt, kein Menü aus Modi

Versteh-Mir besteht nicht aus getrennten Produkten für Anfänger, Ideenfindung, Übersetzung und Sicherheit.

Es gibt einen durchgehenden Verständigungskreis.

Der Mensch muss keinen Modus auswählen. Er sieht immer dieselbe kleine Oberfläche und darf beginnen mit:

- einem klaren Auftrag,
- einem Problem,
- „Ich habe keinen Plan“,
- einem einzelnen Wort,
- einem Bild oder Vergleich,
- mehreren unverbundenen Gedanken,
- einer ungewöhnlichen Beziehung,
- „Ich verstehe gar nichts“,
- oder einer fertigen Agentenantwort.

Intern ändert Versteh-Mir nur seine nächste Verständigungsstrategie:

- abholen,
- spiegeln,
- nach einer Verbindung fragen,
- einen Begriff erklären,
- die Darstellung wechseln,
- eine Hypothese bestätigen lassen,
- einen prüfbaren Wunsch bilden,
- einen Agentenplan erklären,
- oder eine bestätigte Handlung freigeben.

Diese Strategien sind keine sichtbaren Produktmodi. Sie dienen alle demselben Ziel: gemeinsam bestätigte Bedeutung.

## 3. Die gemeinsame Klammer: bestätigte Bedeutung

Alle Situationen unterscheiden sich nur darin, wie viel bereits bestätigt ist.

| Ausgangslage | Was intern fehlt | Nächster kleinster Schritt |
|---|---|---|
| Klarer Wunsch | Bestätigung der Bedeutung | Wunsch in einem Satz spiegeln |
| Kein Plan | Ziel oder nächster Zweck | Kleinste bekannte Aussage spiegeln und eine Frage stellen |
| Ungewöhnliche Fragmente | Bestätigte Beziehung | Nach genau einer Verbindung fragen |
| Mensch versteht Erklärung nicht | Passende Darstellung | Eine Ebene zurückgehen oder Darstellung wechseln |
| KI erkennt mögliches Muster | Menschliche Bestätigung | Muster als Hypothese und Frage zeigen |
| Bestätigter Wunsch | Agentenplan | Nur Planen erlauben |
| Agentenplan vorhanden | Verstandene Folgen | Wirkung in Menschensprache erklären |
| Plan bestätigt | Technische Freigabe | Exakt gebundene Einmal-Freigabe erzeugen |
| Ergebnis vorhanden | Gemeinsames Bild des Geschehenen | Gemessene Wirkung zurückmelden |

Kein Zustand berechtigt Versteh-Mir dazu, fehlende Bedeutung zu erfinden.

## 4. Verantwortungsverteilung

Vier Verantwortungen bleiben technisch getrennt:

### Der Mensch

- liefert Worte, Fragmente, Signale und Korrekturen,
- bestätigt oder verwirft Bedeutungsbeziehungen,
- entscheidet über den nächsten Schritt,
- kann jederzeit stoppen.

### Das Bedeutungsmodul

- bewahrt Originalaussagen,
- schlägt Spiegelungen, Fragen, Beispiele und mögliche Beziehungen vor,
- kennzeichnet Unsicherheit,
- darf keine Bestätigung erzeugen.

### Die Zustandsmaschine

- verarbeitet nur typisierte Ereignisse,
- entscheidet anhand bestätigter Daten, welcher Zustand folgt,
- verwirft alte Pläne nach jeder Bedeutungsänderung,
- darf keine freie KI-Interpretation als menschliche Zustimmung behandeln.

### Der Capability Broker

- besitzt als einzige Komponente verändernde Fähigkeiten,
- prüft Freigabe, Plan-Hash, Sitzung, Ablaufzeit und Einmaligkeit,
- blockiert jede nicht genehmigte Abweichung,
- meldet die tatsächlich gemessene Wirkung zurück.

Kurz:

> Die KI schlägt Bedeutung vor. Der Mensch bestätigt sie. Die Zustandsmaschine erteilt Freigaben. Der Broker handelt.

## 5. Was niemals vermutet wird

Versteh-Mir vermutet nicht:

- Fachwissen,
- Intelligenz,
- Bildungsstand,
- Beruf,
- Diagnose,
- Belastbarkeit,
- Ziel,
- Motivation,
- bevorzugte Darstellung,
- Bedeutung einer ungewöhnlichen Verbindung,
- Zustimmung.

Rechtschreibung, Satzbau, Antwortlänge, Alter, Stimme oder bisherige Fehler sind keine Grundlage für eine Bewertung des Menschen.

Als bekannt gilt nur:

1. was der Mensch ausdrücklich gesagt hat,
2. was er ausdrücklich bestätigt hat,
3. was durch eine zuvor bestätigte, schreibgeschützte Untersuchung beobachtet wurde.

Alles andere ist unbekannt oder Hypothese.

## 6. Das gemeinsame Bedeutungsobjekt

Alle Strategien arbeiten auf demselben sitzungsgebundenen Objekt.

~~~ts
type Source =
  | "human_statement"
  | "human_confirmation"
  | "approved_observation"
  | "ai_hypothesis";

type OriginalFragment = {
  id: string;
  text: string;
  createdAt: string;
};

type GroundedFact = {
  id: string;
  value: string;
  source: Exclude<Source, "ai_hypothesis">;
  evidenceFragmentIds: string[];
};

type OpenQuestion = {
  id: string;
  question: string;
  about: string;
};

type MeaningNode = {
  id: string;
  label: string;
  originalFragmentIds: string[];
};

type MeaningEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
  source: Source;
  status: "open" | "confirmed" | "rejected";
  evidenceFragmentIds: string[];
};

type SharedUnderstanding = {
  sessionId: string;
  revision: number;
  originalFragments: OriginalFragment[];
  groundedFacts: GroundedFact[];
  unknowns: string[];
  openQuestions: OpenQuestion[];
  nodes: MeaningNode[];
  edges: MeaningEdge[];
  currentAtom: UnderstandingAtom | null;
};

type UnderstandingAtom = {
  id: string;
  kind:
    | "reflection"
    | "question"
    | "term"
    | "relation"
    | "intent"
    | "plan_effect"
    | "result";
  plainText: string;
  sourceIds: string[];
  requiresSignal: true;
};
~~~

Regeln:

- OriginalFragment ist unveränderlich.
- Eine spätere Deutung überschreibt niemals das Original.
- Ein KI-Vorschlag erhält source ai_hypothesis.
- Nur der Mensch kann eine offene Beziehung bestätigen.
- Abgelehnte Beziehungen bleiben nachvollziehbar, dürfen aber keine Planung begründen.
- Jede Änderung bestätigter Bedeutung erhöht revision.
- Jede neue Revision verwirft Intent, Plan und Freigabe der alten Revision.
- Das Objekt bleibt im MVP im Speicher und gehört nur zur aktuellen Sitzung.
- Keine dauerhafte Persönlichkeits- oder Denkprofilbildung.

## 7. Immer nur ein Bedeutungsatom

Die Oberfläche zeigt nie die gesamte interne Landkarte.

Sie zeigt genau ein UnderstandingAtom:

- einen Spiegel-Satz,
- eine Frage,
- einen Begriff,
- eine Beziehung,
- einen prüfbaren Wunsch,
- eine Planwirkung,
- oder ein Ergebnis.

Darauf reagiert der Mensch mit:

- weiß,
- unsicher,
- gar nichts,
- einer freien Antwort, wenn eine Frage offen ist,
- oder Stopp.

Das verhindert, dass ein Mensch einer langen, scheinbar plausiblen Erklärung pauschal zustimmt.

## 8. Die drei Signale

### weiß

Bedeutung:

> Ich verstehe genau das aktuell gezeigte Bedeutungsatom und erlaube nur den klar benannten nächsten Schritt.

Regeln:

- Nur weiß, weiss oder der sichtbare Button zählen.
- ja, okay, passt und weiter zählen nicht als Freigabe.
- weiß ich nicht zählt niemals.
- weiß bestätigt nie automatisch frühere oder spätere Inhalte.
- Ein Agent, eine Datei, eine Webseite oder ein Sprachmodell kann kein weiß erzeugen.

### unsicher

Bedeutung:

> An diesem Atom ist etwas unklar oder möglicherweise falsch.

Folge:

- Atom bleibt unbestätigt.
- Versteh-Mir stellt genau eine Frage zu diesem Punkt.
- Die nächste freie Antwort wird als menschliche Klarstellung verarbeitet.
- Keine Planung oder Handlung.

### gar nichts

Bedeutung:

> Der Begriff oder die dargestellte Ebene erreicht mich nicht.

Folge:

- einen benannten Begriff in einem Satz erklären,
- oder eine konzeptuelle Ebene zurückgehen,
- oder Darstellung wechseln: Alltagssprache, Beispiel, Vergleich, Bild oder konkrete Situation,
- danach am selben Bedeutungsproblem bleiben.

gar nichts ohne benannten Begriff führt zu:

> Welches Wort oder welcher Teil ist gerade nicht verständlich?

## 9. Strategie A: Den Menschen abholen

Diese Strategie gilt, wenn noch kein kleiner prüfbarer Zweck vorhanden ist.

Versteh-Mir beginnt mit der kleinsten belegten Aussage.

Beispiel:

Mensch:

> Ich habe keinen Plan mehr.

Versteh-Mir:

> Du weißt gerade noch nicht, welcher Weg richtig ist, möchtest aber nicht einfach blind weitermachen. Stimmt das?

Nach weiß folgt eine einzige Frage, die an den Worten des Menschen ansetzt.

Mögliche Formen:

- Was soll nicht so bleiben?
- Woran merkst du, dass es nicht weitergeht?
- Was wäre eine kleine Verbesserung?
- Soll ich zunächst nur den aktuellen Stand ansehen und nichts verändern?

Das sind keine feste Frageliste und keine Diagnose. Die konkrete Frage muss aus bestätigtem Kontext entstehen.

„Ich weiß es nicht“ bleibt eine gültige Antwort. Dann:

1. Antwort akzeptieren.
2. Weniger voraussetzen.
3. Frage oder Darstellung wechseln.
4. Höchstens einen kleinen, sicheren und umkehrbaren Orientierungsschritt anbieten.
5. Keine Müdigkeit oder Verwirrung in Zustimmung umdeuten.

Ein schreibgeschützter Blick auf einen klar benannten Bereich kann selbst der erste prüfbare Zweck sein. Auch dafür ist ein weiß nötig.

## 10. Strategie B: Ungewöhnliche Denkwege erkunden

Diese Strategie gilt, wenn Gedanken vorhanden sind, ihre Beziehungen aber noch nicht sichtbar oder bestätigt sind.

Beispiel:

> Der Tresor ist wie ein Container, Tresore könnten miteinander reden und später vielleicht eine Identität haben.

Versteh-Mir normalisiert das nicht sofort zu einer bekannten Architektur.

Es bewahrt zunächst:

- Tresor,
- Container,
- Kommunikation zwischen Tresoren,
- Identität,
- die Originalaussage.

Dann fragt es nur nach einer Beziehung:

> Was ist für dich bei Tresor und Container gleich?

Oder:

> Warum braucht ein Tresor in deiner Vorstellung eine Identität?

Regeln:

- Das zunächst Absurde ist weder Fehler noch Wahrheit.
- Widersprüche dürfen vorläufig nebeneinander bestehen.
- Kohärenz muss nicht in einer Antwort entstehen.
- Spätere Aussagen dürfen frühere Fragmente verbinden.
- Wiederkehrende Muster werden als Frage gezeigt.
- Versteh-Mir vergibt keine Labels wie unlogisch, genial, krank oder verwirrt.
- Nur bestätigte Beziehungen dürfen Teil eines Intent werden.
- Wenn keine Verbindung tragfähig wird, bleibt sie offen.

## 11. Strategie C: Einen prüfbaren Wunsch bilden

Ein Intent darf erst entstehen, wenn mindestens Folgendes bestätigt ist:

- ein kleiner Zweck oder ein bewusst gewählter Orientierungsschritt,
- das betroffene Ziel oder der erlaubte Bereich,
- der unmittelbar nächste Schritt,
- wichtige Verbote oder Grenzen,
- weiterhin offene Punkte.

Offene Punkte dürfen bestehen, müssen aber sichtbar sein.

~~~ts
type IntentSpec = {
  id: string;
  understandingRevision: number;
  goal: string;
  target: string | null;
  nextAllowedStep: "orient_read" | "plan_only";
  constraints: string[];
  forbiddenEffects: string[];
  unresolved: string[];
  plainSummary: string;
  sourceIds: string[];
};
~~~

Gate 1 zeigt plainSummary als ein Bedeutungsatom.

Erstes weiß erlaubt nur:

- den gezeigten, schreibgeschützten Orientierungszugriff,
- oder die Erstellung eines Agentenplans.

Es erlaubt keine Veränderung.

## 12. Strategie D: Agentenplan verständlich machen

Der Agent liefert keinen freien Werbetext, sondern einen strukturierten ActionPlan.

~~~ts
type PlannedOperation = {
  id: string;
  capability: string;
  target: string;
  arguments: Record<string, unknown>;
  effect: string;
  risk:
    | "read"
    | "local_change"
    | "destructive"
    | "external_send"
    | "secret_access"
    | "financial";
  reversible: boolean;
};

type ActionPlan = {
  id: string;
  intentId: string;
  understandingRevision: number;
  operations: PlannedOperation[];
  expectedResult: string;
  planHash: string;
};
~~~

Versteh-Mir erzeugt die Erklärung nicht nur aus Agentenprosa. Kritische Folgen werden aus den strukturierten Operationen bestimmt:

- was gelesen wird,
- was verändert wird,
- was gelöscht wird,
- was den Rechner verlässt,
- welche Geheimnisse benötigt werden,
- welche Kosten entstehen,
- was rückgängig gemacht werden kann.

Die Oberfläche zeigt jeweils ein kritisches Bedeutungsatom. Erst wenn der Mensch die gesamte sichtbare Wirkung bestätigt hat, wird Gate 2 erreicht.

## 13. Strategie E: Exakt freigeben und ausführen

Gate 2 bindet die Freigabe an:

- sessionId,
- understandingRevision,
- planHash,
- einmalige Nonce,
- kurze Ablaufzeit.

Die Freigabe gilt nur einmal.

Jede zusätzliche, veränderte oder neue Operation:

1. stoppt die Ausführung,
2. macht die Freigabe ungültig,
3. wird als neues Bedeutungsatom erklärt,
4. verlangt erneut weiß.

Der Capability Broker ist die einzige Komponente mit verändernden Fähigkeiten. Ein Adapter oder Agent besitzt keine direkte Umgehung.

## 14. Gemeinsame Zustandsmaschine

~~~mermaid
flowchart TD
    A["Menschliche Eingabe"] --> B["Understanding Loop"]
    B --> C{"Intent bestätigt?"}
    C -- "Nein" --> B
    C -- "Ja" --> D["Nur planen"]
    D --> E["Planwirkung verstehen"]
    E --> F{"Plan bestätigt?"}
    F -- "Nein" --> B
    F -- "Ja" --> G["Exakt ausführen"]
    G --> H["Gemessenes Ergebnis"]
    H --> B
~~~

Technische Hauptzustände:

| Hauptzustand | Interne Strategie | Erlaubte Wirkung |
|---|---|---|
| idle | Eingabe aufnehmen | keine Agentenfähigkeit |
| understanding | abholen, erkunden, erklären, spiegeln | keine Agentenfähigkeit |
| review_intent | Intent-Atom prüfen | keine Agentenfähigkeit |
| planning | bestätigten Bereich lesen und Plan erstellen | begrenztes Lesen |
| review_plan | Planfolgen atomweise prüfen | keine Veränderung |
| executing | gehashten Plan einmalig ausführen | exakt genehmigte Operationen |
| result | gemessene Wirkung erklären | keine neue Aktion |
| blocked | Fehler oder Abweichung zeigen | alles gesperrt |

orienting und exploring sind Strategien innerhalb von understanding. Der Mensch wählt sie nicht aus.

## 15. Deterministische Next-Step-Policy

Ein Sprachmodell darf nicht frei entscheiden, wie der Prozess fortgesetzt wird.

Die Zustandsmaschine wählt nach dieser Priorität:

1. Stopp oder Sicherheitsfehler behandeln.
2. Offenes menschliches Signal behandeln.
3. Freie Antwort auf die aktuelle Frage aufnehmen.
4. Verlangten Begriff erklären oder Darstellung wechseln.
5. Genau eine offene Beziehung prüfen.
6. Genau eine fehlende Angabe erfragen.
7. Kleinstmöglichen Intent zur Bestätigung vorschlagen.
8. Nach Gate 1 nur Planen erlauben.
9. Planfolgen vollständig und atomweise erklären.
10. Nach Gate 2 exakt ausführen.

Das Bedeutungsmodul darf Texte für den gewählten Schritt vorschlagen. Es darf die Priorität nicht umgehen.

## 16. Was der Mensch sieht

Das MVP zeigt:

- Versteh-Mir,
- Verbunden mit Agentenname oder Nicht verbunden,
- aktuelle Stufe in Alltagssprache,
- ein Bedeutungsatom,
- weiß,
- unsicher,
- gar nichts,
- Textfeld,
- Mikrofon, wenn sicher verfügbar,
- Stopp oder Von vorn.

Es zeigt kein Pflicht-Dashboard und keine bedienbare Bedeutungsgraphik.

Optional darf später „Wie kamen wir hierher?“ die bestätigten Fragmente und Beziehungen nachvollziehbar machen. Das ist keine Voraussetzung für das MVP.

## 17. Vier Golden Journeys

Dieselben UI-Komponenten, dieselbe Zustandsmaschine und dasselbe SharedUnderstanding müssen vier Referenzreisen bestehen.

### Journey 1: Klarer Wunsch

Eingabe:

> Ändere in der README den Projektsatz, aber sonst nichts.

Erwartung:

- Intent spiegeln.
- Gate 1.
- Agent plant genau eine Dateiänderung.
- Wirkung erklären.
- Gate 2.
- Exakt eine Änderung.
- Ergebnis messen.

### Journey 2: Kein Plan

Eingabe:

> Ich weiß nicht mehr, was bei meinem Projekt als Nächstes wichtig ist.

Erwartung:

- kein Fehler und kein erfundener Plan,
- kleinste belegte Aussage,
- eine Frage,
- „Ich weiß es nicht“ akzeptieren,
- optional einen schreibgeschützten Orientierungsblick vorschlagen,
- Gate 1 für diesen Leseschritt,
- genau eine begründete nächste Richtung erklären.

### Journey 3: Ungewöhnliche Verbindung

Eingabe:

> Ein Tresor könnte wie ein Container sein und vielleicht später eine eigene Identität brauchen.

Erwartung:

- Original bewahren,
- Begriffe als Knoten erfassen,
- keine Standardarchitektur erfinden,
- genau eine Verbindung erfragen,
- KI-Muster als Hypothese zeigen,
- nur bestätigte Beziehung in Intent übernehmen.

### Journey 4: Mensch kann nicht folgen

Eingabe:

> Gar nichts.

Erwartung:

- nicht einfach länger erklären,
- Begriff erfragen,
- Sprachebene reduzieren,
- anderes Beispiel oder andere Darstellung anbieten,
- Pause und Stopp erlauben,
- keine Zustimmung erzeugen.

## 18. Protokollinvarianten

1. Kein Originalfragment wird überschrieben.
2. Keine KI-Hypothese wird ohne menschliche Bestätigung zum Fakt.
3. Kein Profil wird aus Sprache oder Verhalten abgeleitet.
4. Pro Schritt wird nur ein Bedeutungsatom bestätigt.
5. weiß gilt nur für das aktuelle Atom.
6. Keine Agentenausgabe kann weiß erzeugen.
7. Ohne Gate 1 keine Agentenplanung.
8. Nach Gate 1 nur begrenztes Lesen und Planen.
9. Ohne Gate 2 keine Veränderung.
10. Jede Bedeutungsrevision verwirft alte Pläne.
11. Jede Planänderung verwirft alte Freigaben.
12. Freigaben sind einmalig, kurzlebig und sitzungsgebunden.
13. Ungeplante Operationen werden blockiert.
14. Das Ergebnis beschreibt gemessene Wirkung statt Absicht.
15. Fehler schließen das Gate.
16. Stopp ist jederzeit möglich.
17. Kein externer Schlüssel ist für Demo- und Manual-Betrieb erforderlich.
18. Verbindungen zu Agenten werden niemals vorgetäuscht.

## 19. Referenztests

Vor einer echten Agentenanbindung müssen maschinenlesbare Golden-Journey-Fixtures existieren:

~~~text
tests/fixtures/
  clear-intent.json
  no-plan.json
  nonlinear-idea.json
  cannot-follow.json
~~~

Jede Fixture enthält:

- menschliche Eingaben,
- erwartete Zustände,
- erlaubte nächste Strategien,
- verbotene Annahmen,
- bestätigte und offene Bedeutungsbeziehungen,
- erwartete Gate-Zeitpunkte,
- erlaubte und blockierte Fähigkeiten.

Pflichttests:

- Alle vier Journeys laufen durch dieselbe öffentliche UI und State Machine.
- Kein Journey-spezifischer Sonderweg darf Sicherheitsregeln umgehen.
- Ein Modellwechsel verändert nicht die Protokollinvarianten.
- Ein absichtlich „hilfreiches“ Modell kann keine fehlenden Fakten ergänzen.
- Ein bösartiger Agent kann kein menschliches Signal fälschen.
- Ein geänderter Plan kann keine alte Freigabe verwenden.

## 20. MVP-Grenze

Das Core Protocol ist im MVP erfüllt, wenn:

- alle vier Golden Journeys funktionieren,
- ein Mensch keinen Plan und kein Fachwissen mitbringen muss,
- ungewöhnliche Gedanken unverfälscht bleiben,
- bestätigte Bedeutung nachvollziehbar ist,
- dieselbe Oberfläche alle Ausgangslagen trägt,
- Gate 1 technisch nur Planen erlaubt,
- Gate 2 technisch exakt eine Planrevision freigibt,
- ein Testadapter das Gate nicht umgehen kann,
- Ergebnis und Abweichungen verständlich zurückkommen,
- und ein fremder Mensch den Kreis ohne Handbuch durchlaufen kann.

Erst danach folgen echte Agentenadapter, lokale Spracherkennung, Desktop-Verpackung und weitere Integrationen.

## 21. Implementierungsauftrag

Die bauende KI beginnt nicht mit Grok Build.

Reihenfolge:

1. SharedUnderstanding und Provenienztypen.
2. UnderstandingAtom und exakte Signale.
3. gemeinsame Understanding Loop mit Next-Step-Policy.
4. vier Golden-Journey-Fixtures.
5. reine Zustandsmaschine.
6. kleine gemeinsame UI.
7. Demo- und Manual-Adapter.
8. IntentSpec und Gate 1.
9. ActionPlan, Plan-Hash und Gate 2.
10. Capability Broker im Test-Arbeitsverzeichnis.
11. adversariale Tests.
12. erst danach Prüfung einer echten Agentenschnittstelle.

Vor jedem Commit muss gelten:

> Diese Änderung hilft Versteh-Mir, bestätigte Bedeutung aufzubauen oder eine bestätigte Grenze technisch einzuhalten; sie erfindet weder den Menschen noch seine Zustimmung.
