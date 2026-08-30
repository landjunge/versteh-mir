# Versteh-Mir – verbindlicher Bauplan

Stand: 30. August 2026  
Repo: https://github.com/landjunge/versteh-mir  
Status: verbindliche technische Zielbeschreibung für die nächste Implementierung

Dieser Bauplan erweitert den ersten Entwurf in docs/PLAN.md. Der alte Plan bleibt als Ursprung der Idee erhalten. Bei Widersprüchen für neue Implementierungen gilt dieses Dokument.

## 0. Auftrag an die bauende KI

Lies vor jeder Änderung in dieser Reihenfolge:

1. README.md
2. docs/IDEA.md
3. docs/BRAINSTORM.md
4. docs/PLAN.md
5. dieses Dokument
6. den vorhandenen Quellcode und alle Tests

Arbeite danach ausschließlich etappenweise. Eine Etappe wird vollständig getestet und dokumentiert, bevor die nächste beginnt.

Verbindliche Regeln:

- Nicht raten und keine fehlende Integration vortäuschen.
- Keine Browser-Cookies, Sitzungstoken oder Zugangsdaten aus fremden Dateien auslesen.
- Keine vorhandene Sitzung durch Scraping oder inoffizielle Umgehungen kapern.
- Keine Aktion als „freigegeben“ bezeichnen, wenn das technische Handlungstor sie nicht wirklich erzwingt.
- Kein Agent darf selbst eine menschliche Freigabe erzeugen.
- Bei einem Widerspruch zwischen Dokumentation und Code zuerst den Widerspruch dokumentieren, dann die sicherere Variante umsetzen.
- Wenn eine echte Grok-Build-Anbindung über eine unterstützte Schnittstelle nicht möglich ist, offen „Nicht verbunden“ anzeigen und mit dem manuellen Adapter weiterarbeiten.
- Keine Abhängigkeit zu Gnom-Hub, ThreadDesk, Tollgate, 4AllPass oder anderen Projekten herstellen.
- Keine neuen Funktionen außerhalb der jeweils aktiven Etappe ergänzen.
- Pro Etappe einen kleinen, prüfbaren Commit erstellen.

## 1. Produktkern

Versteh-Mir ist kein Prompt-Optimierer und kein zusätzlicher Chat-Agent.

Versteh-Mir ist eine lokale Verständigungs- und Einwilligungsschicht zwischen einem Menschen und einer handelnden KI.

Leitsatz:

> Nicht besser prompten. Erst dasselbe meinen.

Produktversprechen:

> Versteh-Mir zeigt dem Menschen in seiner Sprache, was eine KI aus seinen Worten verstanden hat und was sie als Nächstes tun will. Erst nach einer eindeutigen Freigabe darf die geplante Handlung stattfinden.

Das Produkt löst eine asymmetrische Situation:

- Die KI kann aus unvollständiger Alltagssprache konkrete technische Handlungen ableiten.
- Der Mensch sieht diese Ableitung normalerweise nicht vollständig.
- Eine flüssige KI-Antwort kann richtig klingen, obwohl Annahmen, Reichweite oder Folgen falsch verstanden wurden.
- Versteh-Mir macht die verborgene Bedeutungsübersetzung sichtbar und bindet technische Fähigkeiten an die menschliche Freigabe.

Versteh-Mir behauptet nicht, menschliches Verständnis beweisen zu können. Es erzwingt einen sichtbaren Verständigungsprozess und eine eindeutige, begrenzte Zustimmung.

## 2. Unverhandelbare Eigenschaften

1. Lokal zuerst.
2. Kein Cloud-Konto für Versteh-Mir.
3. Kein eigener KI-Schlüssel als Voraussetzung für den Grundbetrieb.
4. Eine kleine Oberfläche, kein Dashboard.
5. Sprache und Tastatur sind gleichwertige Eingaben.
6. Genau drei Verständigungssignale:
   - weiß
   - unsicher
   - gar nichts
7. Zwei getrennte Freigaben:
   - erstes weiß: Bedeutung bestätigen und begrenztes Planen erlauben
   - zweites weiß: den unveränderten, sichtbaren Plan einmalig ausführen
8. Vor dem zweiten weiß keine schreibende, löschende, sendende, zahlende oder sonstige verändernde Aktion.
9. Jede Planänderung macht eine vorhandene Ausführungsfreigabe ungültig.
10. Fehler führen zum sicheren Zustand: blockiert statt automatisch weiter.
11. Der Status „Verbunden mit …“ muss technisch wahr sein.
12. Keine Telemetrie und keine Verlaufsübertragung durch Versteh-Mir.
13. Barrierefreiheit ist Bestandteil des Kerns.
14. Versteh-Mir bleibt ein eigenes Produkt ohne Abhängigkeit zu anderen Landjunge-Projekten.

## 3. Was der erste nutzbare Stand leisten muss

Der erste nutzbare Stand, im Folgenden MVP genannt, beherrscht einen vollständigen Kreis:

1. Der Mensch spricht oder tippt einen Wunsch.
2. Versteh-Mir erzeugt eine kurze, prüfbare Bedeutungsfassung.
3. Der Mensch reagiert mit weiß, unsicher oder gar nichts.
4. Bei unsicher wird genau eine gezielte Frage gestellt.
5. Die freie Antwort auf diese Frage wird angenommen und die Bedeutungsfassung wird neu erzeugt.
6. Bei gar nichts wird genau ein benannter Begriff in einem Satz erklärt.
7. Beim ersten weiß erhält der Agent nur die Erlaubnis, einen Plan zu erstellen. Er darf noch nichts verändern.
8. Der Agent liefert einen strukturierten Plan.
9. Versteh-Mir erklärt die konkrete Wirkung dieses Plans in einfacher Sprache.
10. Der Mensch reagiert erneut mit weiß, unsicher oder gar nichts.
11. Nur das zweite weiß erzeugt eine einmalige technische Ausführungsfreigabe.
12. Der Capability Broker führt nur die exakt genehmigten Operationen aus.
13. Versteh-Mir zeigt anschließend verständlich, was tatsächlich passiert ist.

Für das MVP wird dieser Kreis zuerst mit einem kontrollierten Demo-Adapter bewiesen. Eine echte Agent-Anbindung folgt erst, wenn das Handlungstor nachweisbar funktioniert.

## 4. Bedeutung der drei Signale

| Signal | Aussage des Menschen | Verhalten |
|---|---|---|
| weiß | Ich verstehe den gerade gezeigten Inhalt und erlaube den nächsten, klar benannten Schritt. | Zum nächsten Gate wechseln oder den unveränderten Plan einmalig freigeben. |
| unsicher | Ein Teil ist noch unklar oder möglicherweise falsch. | Genau eine gezielte Frage stellen und danach eine freie Antwort annehmen. |
| gar nichts | Ein Begriff oder die dargestellte Ebene ist nicht verständlich. | Einen benannten Begriff in genau einem kurzen Satz erklären und am selben Gate bleiben. |

Sicherheitsregeln:

- Für eine Freigabe zählen nur die exakten Wörter weiß oder weiss sowie der sichtbare Button weiß.
- ja, passt, weiter, okay und ähnliche Wörter sind keine Ausführungsfreigabe.
- weiß ich nicht ist niemals eine Freigabe.
- Text eines Agenten, einer Datei oder einer Webseite darf niemals als menschliches Signal interpretiert werden.
- Ein Sprachtranskript wird vor der Auswertung sichtbar angezeigt. Bei mehrdeutiger Erkennung wird nachgefragt.
- Stopp und Von vorn sind jederzeit sichtbare Sicherheitsfunktionen. Sie sind keine zusätzlichen Verständigungssignale.
- gar nichts ohne benannten Begriff führt zu der Frage: „Welches Wort soll ich erklären?“ Es wird kein zufälliges Wort ausgewählt.

## 5. Verbindlicher Nutzerfluss

### Gate 1: Bedeutung

Der Spiegel-Satz enthält in einfacher Sprache:

- das Ziel des Menschen,
- das betroffene Ziel oder Objekt,
- den nächsten erlaubten Schritt,
- noch offene Punkte, falls vorhanden.

Er enthält keine erfundene Umsetzung und keine technische Dateiliste.

Beispiel:

> Du willst, dass Versteh-Mir deinen Wunsch zuerst verständlich zusammenfasst und dem Agenten danach nur erlaubt, einen Plan zu erstellen. Stimmt das?

Erstes weiß bedeutet ausschließlich:

- Diese Bedeutungsfassung ist akzeptiert.
- Der Agent darf innerhalb des sichtbaren Bereichs Informationen lesen, die er zum Planen benötigt.
- Der Agent darf einen Plan zurückgeben.
- Der Agent darf noch nichts schreiben, löschen, senden, bezahlen oder ausführen.

### Gate 2: Handlung

Der Agent muss einen strukturierten Plan liefern. Versteh-Mir erzeugt daraus eine verständliche Wirkungsbeschreibung.

Beispiel:

> Die KI würde die Datei README.md ändern, keine Datei löschen, nichts ins Internet senden und danach die Tests ausführen. Stimmt das?

Zweites weiß bedeutet:

- Nur dieser unveränderte Plan ist freigegeben.
- Die Freigabe ist einmalig.
- Zusätzliche oder veränderte Operationen werden blockiert und müssen erneut erklärt werden.

### Ergebnis

Nach der Ausführung wird keine Absicht, sondern das gemessene Ergebnis gezeigt:

> README.md wurde geändert, drei Tests liefen erfolgreich und sonst wurde nichts verändert.

Fehler werden konkret benannt. Ein Fehler führt nicht automatisch zu einem neuen Versuch mit erweitertem Umfang.

## 6. Zustandsmaschine

Die Zustandsmaschine liegt als reine, deterministische Kernlogik vor. UI, Übersetzungsmodell und Adapter dürfen Zustände nicht direkt verändern, sondern senden typisierte Ereignisse.

| Zustand | Erlaubte Eingabe | Nächster Zustand | Seiteneffekt |
|---|---|---|---|
| idle | menschlicher Wunsch | review_intent | Bedeutungsfassung erzeugen |
| review_intent | weiß | planning | begrenzte Planungsfreigabe erstellen |
| review_intent | unsicher | clarify_intent | eine Frage erzeugen |
| review_intent | gar nichts | explain_intent | einen Begriff erklären |
| clarify_intent | freie menschliche Antwort | review_intent | Intent-Revision erhöhen und neu spiegeln |
| explain_intent | weiß, unsicher, gar nichts oder Begriff | review_intent oder explain_intent | keine Agentenaktion |
| planning | gültiger Agentenplan | review_plan | Plan validieren, hashen und erklären |
| planning | Fehler oder verbotene Aktion | blocked | Freigabe entziehen |
| review_plan | weiß | executing | einmalige Ausführungsfreigabe erzeugen |
| review_plan | unsicher | clarify_plan | eine Frage erzeugen |
| review_plan | gar nichts | explain_plan | einen Begriff erklären |
| clarify_plan | freie menschliche Antwort | planning | alten Plan verwerfen und neu planen |
| explain_plan | weiß, unsicher, gar nichts oder Begriff | review_plan oder explain_plan | keine Ausführung |
| executing | zulässiges Ergebnis | result | Ergebnis messen und erklären |
| executing | Abweichung, Fehler oder neue Operation | blocked | sofort stoppen |
| result | Von vorn oder neuer Wunsch | idle oder review_intent | Sitzung abschließen |
| blocked | Von vorn oder bewusster Neuversuch | idle oder review_intent | keine automatische Fortsetzung |

Zusätzliche Invarianten:

- Nur review_plan plus gültiges zweites weiß kann executing erreichen.
- Ein Plan gehört exakt zu einer Intent-Revision.
- Jede Klarstellung erhöht die Revision und verwirft Plan und Freigabe.
- Ein Neustart des Daemons verwirft jede offene Freigabe.
- Zwei gleichzeitige Sitzungen dürfen ihre Freigaben niemals teilen.
- Ein Agentenereignis kann kein menschliches Ereignis vortäuschen.

## 7. Vertrauensgrenzen

Vertraut wird nur dem lokalen Gate-Kern und dem Capability Broker.

Nicht vertraut werden:

- dem Sprachtranskript,
- dem Übersetzungsmodell,
- dem Agenten,
- dem Inhalt gelesener Dateien,
- Webseiten oder Repository-Inhalten,
- vom Agenten erzeugten Zusammenfassungen.

Die Architektur:

~~~mermaid
flowchart TD
    UI["Kleines Fenster"] --> D["Lokaler Daemon"]
    D --> M["Bedeutungsmodul"]
    D --> A["Agent-Adapter"]
    A --> B["Capability Broker"]
    B --> T["Dateien und Werkzeuge"]
~~~

Regeln:

- Die UI sendet menschliche Eingaben über einen eigenen authentisierten Kanal.
- Der Agentenkanal ist davon technisch getrennt.
- Nur der Daemon kann Freigaben erzeugen.
- Der Adapter besitzt keine direkten Schreibfähigkeiten.
- Alle Fähigkeiten laufen durch den Capability Broker.
- Das Bedeutungsmodul darf Text vorschlagen, aber keine Freigabe erzeugen.
- Kritische Folgen werden aus strukturierten Operationen bestimmt, nicht allein aus freiem KI-Text.

## 8. Datenmodelle

Die konkrete Implementierung darf Namen leicht anpassen, die Bedeutung bleibt verbindlich.

~~~ts
type Signal = "weiss" | "unsicher" | "gar_nichts";

type IntentSpec = {
  id: string;
  revision: number;
  originalText: string;
  goal: string;
  target: string | null;
  constraints: string[];
  forbiddenEffects: string[];
  successCondition: string | null;
  unresolved: string[];
  planningReadScope: string[];
  plainSummary: string;
};

type Risk =
  | "read"
  | "local_change"
  | "destructive"
  | "external_send"
  | "secret_access"
  | "financial";

type PlannedOperation = {
  id: string;
  capability: string;
  target: string;
  arguments: Record<string, unknown>;
  effect: string;
  risk: Risk;
  reversible: boolean;
};

type ActionPlan = {
  id: string;
  intentId: string;
  intentRevision: number;
  operations: PlannedOperation[];
  expectedResult: string;
  planHash: string;
};

type ApprovalGrant = {
  sessionId: string;
  planHash: string;
  nonce: string;
  expiresAt: string;
  singleUse: true;
};

type ExecutionResult = {
  planHash: string;
  completed: string[];
  blocked: string[];
  failed: string[];
  measuredSummary: string;
};
~~~

Anforderungen:

- Alle externen Daten werden zur Laufzeit gegen ein Schema validiert.
- planHash wird aus einer stabil kanonisierten Form des vollständigen Plans erzeugt.
- Freigaben werden an sessionId, planHash, Ablaufzeit und eine einmalige Nonce gebunden.
- Änderungen am Plan erzeugen einen neuen Hash.
- Die menschliche Zusammenfassung und der Maschinenplan werden gemeinsam angezeigt beziehungsweise gespeichert, damit später nachvollziehbar bleibt, was genehmigt wurde.
- Rohtexte mit Geheimnissen werden standardmäßig nicht protokolliert.

## 9. Capability Broker

Der Capability Broker ist die wichtigste Sicherheitskomponente.

### Vor dem ersten weiß

Erlaubt:

- keine Agentenfähigkeit,
- keine Dateioperation,
- kein Netzwerkzugriff durch den Agenten.

### Nach dem ersten weiß

Nur mit einer PlanningGrant erlaubt:

- ausdrücklich angezeigte, schreibgeschützte Leseoperationen,
- ausschließlich im bestätigten Bereich,
- keine geheimen Standardverzeichnisse,
- kein Netzwerk,
- keine Prozesse,
- keine Änderungen.

### Nach dem zweiten weiß

Nur mit einer gültigen ApprovalGrant erlaubt:

- exakt die Operationen aus dem gehashten Plan,
- genau einmal,
- innerhalb der Ablaufzeit.

Immer blockiert, wenn nicht separat neu geplant und bestätigt:

- zusätzliche Dateien oder Ziele,
- Löschoperationen,
- externe Nachrichten oder Uploads,
- Zugriff auf Schlüssel oder Geheimnisse,
- Zahlungen,
- nicht vorab beschriebene Shell-Befehle,
- Privilegienerhöhung,
- Netzwerkzugriff.

Für den ersten Sicherheitsnachweis unterstützt der Broker nur kontrollierte Dateioperationen in einem temporären Test-Arbeitsverzeichnis. Allgemeine Shell-Ausführung ist im MVP nicht erlaubt.

Wenn ein Agent während der Ausführung eine neue Operation anfordert:

1. Ausführung anhalten.
2. Grant ungültig machen.
3. Neue Operation in Menschensprache erklären.
4. Zu review_plan zurückkehren.
5. Erneut auf weiß warten.

## 10. Adaptervertrag

Ein Adapter verbindet Versteh-Mir mit genau einem Agenten. Er übersetzt Protokolle, trifft aber keine Freigabeentscheidung.

~~~ts
interface AgentAdapter {
  readonly id: string;
  readonly displayName: string;

  probe(): Promise<{
    connected: boolean;
    reason?: string;
    supportedCapabilities: string[];
  }>;

  createPlan(
    intent: IntentSpec,
    planningContext: { allowedReadScope: string[] }
  ): Promise<ActionPlan>;

  execute(
    plan: ActionPlan,
    grant: ApprovalGrant
  ): AsyncIterable<{
    type: "started" | "operation" | "completed" | "failed";
    operation?: PlannedOperation;
    message?: string;
  }>;

  cancel(runId: string): Promise<void>;
}
~~~

Pflichtadapter:

1. demo  
   Deterministisch, ohne Netzwerk, nur für Tests und Produktfluss.

2. manual  
   Versteh-Mir zeigt die freigegebene Spezifikation zum Kopieren und nimmt einen eingefügten Agentenplan wieder entgegen. Keine vorgetäuschte Verbindung.

3. grok-build  
   Erst implementieren, nachdem eine offiziell unterstützte lokale oder sitzungsgebundene Schnittstelle nachgewiesen wurde.

Für grok-build gilt:

- Eine xAI-API-Verbindung ist nicht automatisch eine Grok-Build-Verbindung.
- Ein allgemeines Modell darf nicht mit dem Systemtext „Du bist Grok Build“ als echter Adapter ausgegeben werden.
- Bestehende Authentifizierung darf nur über eine dafür vorgesehene Schnittstelle genutzt werden.
- Gibt es diese Schnittstelle nicht, bleibt der Adapter sichtbar nicht verbunden.
- Der Grundbetrieb und der manuelle Kreis funktionieren trotzdem ohne zusätzlichen API-Schlüssel.

## 11. Bedeutungsmodul

Das Bedeutungsmodul ist von Agent und Adapter getrennt.

~~~ts
interface MeaningEngine {
  mirrorIntent(input: string): Promise<IntentSpec>;
  askIntentQuestion(intent: IntentSpec): Promise<string>;
  applyIntentAnswer(intent: IntentSpec, answer: string): Promise<IntentSpec>;
  explainTerm(term: string, context: string): Promise<string>;
  explainPlan(plan: ActionPlan): Promise<string>;
  askPlanQuestion(plan: ActionPlan): Promise<string>;
  explainResult(result: ExecutionResult): Promise<string>;
}
~~~

Regeln:

- Der Engine-Ausgang ist ein Vorschlag und wird validiert.
- Fehlende Angaben landen in unresolved und werden nicht erfunden.
- Die Richtung Mensch zu KI oder KI zu Mensch wird aus dem technischen Ursprung der Nachricht bestimmt, nicht durch unsichere Sprachklassifikation.
- Kritische Angaben wie Löschen, Netzwerk, Geheimnisse und Kosten stammen aus PlannedOperation, nicht aus einer freien Modellzusammenfassung.
- Ohne Modellverbindung existiert ein ehrlicher deterministischer Fallback. Dieser darf wörtlich spiegeln und gezielt um Präzisierung bitten.
- Ein externes Bedeutungsmodell darf nur verwendet werden, wenn der verbundene Adapter dies unterstützt und der Nutzer den Verbindungsstatus sehen kann.
- Keine versteckte Schlüsselabfrage.

## 12. Technische Grundlage

Die vorhandene TypeScript- und React-Arbeit wird weiterverwendet. Es findet kein unnötiger Sprachwechsel zu Python statt.

Für den ersten eigenständig ausführbaren Stand:

- TypeScript im strikten Modus
- React für das kleine Fenster
- ein einzelnes Repository, kein Monorepo
- ein gepflegtes Node.js-LTS, im Repository festgehalten
- pnpm mit Lockdatei
- Vite für die lokale UI
- lokaler Node-Daemon auf 127.0.0.1 mit zufälligem Port
- zufälliges Sitzungstoken für UI-zu-Daemon-Kommunikation
- Schema-Prüfung mit einer kleinen, etablierten TypeScript-Bibliothek
- Vitest für Unit- und Integrationstests
- Playwright für wenige entscheidende Ende-zu-Ende-Flows
- Desktop-Verpackung erst nach dem funktionierenden Protokoll, bevorzugt mit Tauri
- keine Cloud-Datenbank

Pflichtskripte:

- pnpm dev
- pnpm test
- pnpm typecheck
- pnpm lint
- pnpm build
- pnpm test:e2e

Der Checkout muss mit dokumentierten Befehlen selbstständig startbar sein.

## 13. Zielstruktur

~~~text
versteh-mir/
  README.md
  package.json
  pnpm-lock.yaml
  tsconfig.json
  vite.config.ts
  docs/
    IDEA.md
    BRAINSTORM.md
    PLAN.md
    BUILD_PLAN.md
    SECURITY_MODEL.md
  src/
    core/
      types.ts
      signals.ts
      state-machine.ts
      policy.ts
      canonical-plan.ts
    meaning/
      types.ts
      deterministic.ts
    adapters/
      types.ts
      demo.ts
      manual.ts
      grok-build.ts
    daemon/
      server.ts
      session-store.ts
      capability-broker.ts
      grants.ts
      audit.ts
    ui/
      App.tsx
      VerstehMirWindow.tsx
      daemon-client.ts
      speech.ts
  tests/
    unit/
    integration/
    e2e/
~~~

SECURITY_MODEL.md wird in Etappe 2 aus den Regeln dieses Dokuments abgeleitet. Es darf den Bauplan nicht abschwächen.

## 14. Migration des vorhandenen Codes

Vorhandenes wird nicht blind gelöscht.

- src/lib/versteh-mir/signals.ts:
  - exakte drei Signale behalten,
  - unsichere Freigabe-Aliase entfernen,
  - Herkunft menschlicher und agentischer Ereignisse trennen.

- src/lib/versteh-mir/daemon.ts:
  - zu einer reinen Zustandsmaschine ohne Netzwerk und UI-Abhängigkeit umbauen,
  - echte Klarstellungszustände ergänzen,
  - Intent-Revision, Plan-Hash und Freigabezustand ergänzen.

- src/lib/versteh-mir/api.ts:
  - zerlegen in Bedeutungsmodul, Agent-Adapter und Daemon-API,
  - XAI_API_KEY aus dem Grundbetrieb entfernen,
  - die vorgetäuschte Grok-Build-Rolle entfernen.

- src/components/versteh-mir/window.tsx:
  - nur noch mit dem lokalen Daemon sprechen,
  - Gate 1, Gate 2 und Ergebnis sichtbar unterscheiden,
  - Stopp jederzeit anbieten,
  - kein technisches Dashboard hinzufügen.

- src/lib/versteh-mir/terms.ts:
  - keine zufällige Auswahl des ersten Inhaltsworts,
  - benannten Begriff erklären oder nach dem Begriff fragen.

- vorhandene Tests:
  - beibehalten und auf die neue Zustandsmaschine migrieren,
  - keine Tests löschen, nur weil sie nach der Korrektur fehlschlagen.

## 15. Oberfläche und Barrierefreiheit

Die Oberfläche bleibt ein kleines Fenster.

Immer sichtbar:

- Versteh-Mir
- Verbunden mit Agentenname oder Nicht verbunden
- aktuelle Stufe: Dein Wunsch, Plan der KI oder Ergebnis
- genau ein aktueller Satz oder eine aktuelle Frage
- die drei Signalflächen
- Textfeld und Mikrofon, wenn verfügbar
- Stopp oder Von vorn

Nicht bauen:

- Projektverwaltung
- Chat-Historie als Dashboard
- Log-Viewer
- Agenten-Marktplatz
- Einstellungsseiten mit vielen Schaltern
- Mehrfachfenster
- automatische Ausführung

Barrierefreiheit:

- vollständig per Tastatur bedienbar
- sichtbarer Fokus
- Screenreader-Beschriftungen und Live-Regionen
- Status nie nur über Farbe ausdrücken
- reduzierte Bewegung respektieren
- gut lesbare Schrift und ausreichender Kontrast
- keine Zeitbegrenzung für die menschliche Antwort
- Sprache ist optional; alle Funktionen bleiben per Tastatur erreichbar
- Vorlesen von möglichen Geheimnissen standardmäßig vermeiden

## 16. Spracheingabe und Datenschutz

Sprache ist wichtig, darf aber das lokale Versprechen nicht heimlich brechen.

MVP-Regeln:

- Push-to-talk, kein dauerhaftes Zuhören.
- Deutlich sichtbarer Mikrofonstatus.
- Audio wird nicht von Versteh-Mir gespeichert.
- Eine Browser-Speech-API wird nicht automatisch als lokal bezeichnet.
- Wenn Erkennung Daten an einen externen Dienst senden könnte, wird dies vor Aktivierung klar angezeigt.
- Lokale Erkennung ist das Ziel; ein optionaler lokaler Speech-Adapter kann später ergänzt werden.
- Tastaturbetrieb ist immer vollständig möglich.
- Sprachausgabe darf abgeschaltet werden und liest keine als geheim markierten Inhalte vor.

## 17. Datenschutz und lokale Sicherheit

- Der Daemon bindet ausschließlich an Loopback.
- Kein Zugriff aus dem lokalen Netzwerk.
- Zufälliger Port und kurzlebiges Sitzungstoken.
- Strikte Origin-Prüfung.
- Keine Telemetrie.
- Keine Roh-Prompts in normalen Logs.
- Fehlermeldungen enthalten keine Schlüssel, Tokens oder vollständigen sensiblen Pfade.
- Sitzungszustand bleibt im MVP im Speicher.
- Ein Neustart verwirft Grants und Nonces.
- Optionaler lokaler Audit-Nachweis enthält nur Zeit, Plan-Hash, Risikoklassen und Ergebnis, keine geheimen Inhalte.
- Externe Netzverbindungen sind standardmäßig gesperrt und nur Bestandteil eines sichtbar verbundenen Adapters.
- Prompt-Inhalte, Agentenantworten und gelesene Dateien gelten als untrusted input.
- Abhängigkeiten werden festgeschrieben und automatisiert geprüft.
- Vor einer Veröffentlichung wird ein Threat Model erstellt und defensiv geprüft.

## 18. Umsetzungsetappen

### Etappe 0 – Repository ausführbar machen

Ziel: Ein fremder Rechner kann den Stand installieren, testen und starten.

Aufgaben:

- package.json, Lockdatei und Konfiguration ergänzen.
- vorhandenen React-Prototyp lokal startbar machen.
- Test-, Typprüfungs-, Lint- und Build-Skripte ergänzen.
- README mit exakten Startbefehlen aktualisieren.
- Continuous Integration für Test, Typecheck und Build ergänzen.
- Bestehende XAI-Verbindung noch nicht ausbauen, aber klar als Prototyp markieren.

Abnahme:

- Frischer Checkout startet nach den dokumentierten Befehlen.
- Alle vorhandenen Tests laufen reproduzierbar.
- Keine Schlüssel sind zum Start des lokalen Fensters nötig.

### Etappe 1 – Verständigungsprotokoll korrekt machen

Ziel: Der vollständige Signal-Kreis funktioniert ohne echten Agenten.

Aufgaben:

- Zustandsmaschine aus Abschnitt 6 implementieren.
- Freie Antwort nach unsicher korrekt verarbeiten.
- Begriff nach gar nichts benennen lassen.
- Exakte Signale durchsetzen.
- Intent-Revisionen einführen.
- Demo- und Manual-Adapter ergänzen.
- UI zeigt Gate 1 und Gate 2 eindeutig.
- Agententext kann kein menschliches Signal auslösen.

Abnahme:

- Alle Signal- und Zustandsübergänge sind getestet.
- Ohne zweites weiß wird keine Demo-Änderung ausgeführt.
- Unklare Sprache wird niemals als Freigabe gewertet.

### Etappe 2 – Echtes Handlungstor

Ziel: Die Freigabe wird technisch erzwungen.

Aufgaben:

- strukturierte Pläne und Schema-Prüfung implementieren.
- kanonischen Plan-Hash implementieren.
- PlanningGrant und ApprovalGrant implementieren.
- Capability Broker mit Test-Arbeitsverzeichnis implementieren.
- Einmaligkeit, Ablaufzeit und Sitzungsbindung erzwingen.
- SECURITY_MODEL.md erstellen.
- Ergebnisse anhand tatsächlicher Operationen messen.

Abnahme:

- Ein bösartiger Testadapter kann ohne Grant nicht schreiben.
- Ein veränderter Plan kann einen alten Grant nicht verwenden.
- Ein wiederverwendeter oder abgelaufener Grant wird blockiert.
- Ein Neustart führt zum sicheren Zustand.
- Nicht geplante Operationen stoppen die Ausführung.

### Etappe 3 – Verständliche Wirkungsübersetzung

Ziel: Menschliche Sprache und technischer Plan bleiben nachweisbar verbunden.

Aufgaben:

- MeaningEngine-Vertrag implementieren.
- deterministischen Offline-Fallback implementieren.
- kritische Folgen regelbasiert aus Operationen erzeugen.
- genau einen Begriff erklären.
- Ergebnistext aus gemessenen Resultaten erzeugen.
- lange oder widersprüchliche Agentenpläne ablehnen.

Abnahme:

- Löschen, externe Übertragung, Geheimniszugriff und Kosten können in Tests nicht aus der Erklärung verschwinden.
- Unbekannte Pflichtangaben bleiben offen statt erfunden zu werden.
- Grundbetrieb funktioniert ohne externes Modell.

### Etappe 4 – Grok-Build-Adapter prüfen und anbinden

Ziel: Eine echte, ehrlich bezeichnete Verbindung.

Aufgaben:

1. Zuerst nachweisen, welche unterstützte Schnittstelle Grok Build für lokale Integration und bestehende Sitzungen bereitstellt.
2. Ergebnis in docs/GROK_BUILD_ADAPTER.md dokumentieren.
3. Nur bei unterstützter Schnittstelle den Adapter implementieren.
4. Plan- und Ausführungskanäle an den Capability Broker binden.
5. Bei fehlender Schnittstelle den Adapter auf Nicht verbunden lassen und den Manual-Adapter als funktionierenden Weg dokumentieren.

Verboten:

- Session-Scraping
- Cookie-Diebstahl
- Browser-Automation zur Umgehung einer fehlenden Schnittstelle
- ein allgemeines Grok-Modell als Grok Build ausgeben
- heimliche API-Key-Pflicht

Abnahme:

- Der Verbindungsstatus ist nachweisbar korrekt.
- Der Agent kann das Gate nicht umgehen.
- Ein Integrationstest belegt Planen vor Ausführen.

### Etappe 5 – Sprache und Desktop-Verpackung

Ziel: Das Werkzeug lässt sich natürlich und lokal benutzen.

Aufgaben:

- Push-to-talk sauber integrieren.
- Datenschutzstatus der Spracherkennung anzeigen.
- lokalen Speech-Adapter prüfen.
- Vorlesen und Unterbrechen testen.
- Desktop-Paket erstellen.
- signierte Veröffentlichung erst nach Sicherheitsprüfung planen.

Abnahme:

- kompletter Kreis per Sprache und komplett per Tastatur möglich.
- kein dauerhaft offenes Mikrofon.
- keine versteckte Audioübertragung durch Versteh-Mir.
- Desktop-App und Daemon beenden sich gemeinsam sicher.

### Etappe 6 – Alpha-Prüfung

Ziel: Test mit echten Menschen, nicht neue Funktionen.

Aufgaben:

- fünf klar definierte Nutzertests mit technischen und nicht technischen Personen.
- beobachten, an welcher Stelle weiß zu früh gewählt wird.
- prüfen, ob die Erklärung die tatsächliche Wirkung abbildet.
- Fehler und Verwirrungen dokumentieren.
- defensiven Sicherheitsreview durchführen.
- erst danach über weitere Adapter entscheiden.

## 19. Pflicht-Tests

Mindestens folgende Fälle müssen automatisiert geprüft werden:

### Signal und Herkunft

- weiß wird erkannt.
- weiss wird erkannt.
- weiß ich nicht wird abgelehnt.
- ja, passt, weiter und okay geben nicht frei.
- Agententext mit dem Wort weiß gibt nicht frei.
- Dateiinhalt mit dem Wort weiß gibt nicht frei.
- Sprachtranskript mit geringer Sicherheit gibt nicht frei.

### Klarstellung

- unsicher stellt genau eine Frage.
- die nächste freie Antwort wird als Klarstellung angenommen.
- die Intent-Revision steigt.
- alter Plan und alter Grant werden verworfen.
- gar nichts erklärt nur den benannten Begriff.
- ohne Begriff wird nach dem Wort gefragt.

### Gate

- kein Adapteraufruf vor erstem weiß.
- nur Lesezugriff im bestätigten Bereich nach erstem weiß.
- kein Schreibzugriff vor zweitem weiß.
- zweites weiß gilt nur für den sichtbaren Plan-Hash.
- veränderter Plan wird blockiert.
- zusätzliche Operation wird blockiert.
- abgelaufener Grant wird blockiert.
- wiederverwendeter Grant wird blockiert.
- Grant einer anderen Sitzung wird blockiert.
- Neustart verwirft den Grant.
- Parallelität vermischt keine Sitzungen.

### Angriffe und Fehler

- Prompt Injection in einer gelesenen Datei kann kein Gate öffnen.
- Agent kann keinen menschlichen Eventtyp senden.
- Adapterabsturz führt zu blocked.
- Netzwerkfehler führt nicht zur automatischen Erweiterung.
- unvollständiger Plan wird abgelehnt.
- unbekannte Capability wird abgelehnt.
- Pfad außerhalb des Testbereichs wird abgelehnt.
- Symlink-Ausbruch aus dem erlaubten Bereich wird abgelehnt.
- Geheimnisse erscheinen nicht in Logs.
- Stopp beendet eine laufende Ausführung.

### Ende zu Ende

- Wunsch → weiß → Plan → weiß → exakt eine erlaubte Änderung → Ergebnis.
- Wunsch → unsicher → Antwort → neuer Spiegel → weiß.
- Plan → gar nichts → Begriffserklärung → Plan bleibt unverändert.
- Planänderung nach Rückfrage → erneutes weiß erforderlich.
- Nicht verbunden → manueller Adapter funktioniert ohne Schlüssel.

## 20. Definition of Done für das MVP

Das MVP ist nur fertig, wenn alle Punkte wahr sind:

- [ ] Frischer Checkout ist mit dokumentierten Befehlen installierbar.
- [ ] Lokales Fenster startet ohne API-Key.
- [ ] Status nennt den echten Adapter.
- [ ] Demo- und Manual-Adapter funktionieren.
- [ ] Der Mensch kann unsicher mit freier Antwort fortsetzen.
- [ ] gar nichts erklärt einen benannten Begriff.
- [ ] Erstes weiß erlaubt nur Planen.
- [ ] Zweites weiß erlaubt nur den unveränderten Plan.
- [ ] Capability Broker erzwingt die Grenze technisch.
- [ ] Nicht geplante Operationen werden blockiert.
- [ ] Freigaben sind einmalig, kurzlebig und sitzungsgebunden.
- [ ] Keine Agentenausgabe kann Zustimmung vortäuschen.
- [ ] Das Ergebnis beschreibt gemessene Änderungen.
- [ ] Sprache und Tastatur sind beide möglich; Tastatur ist vollständig.
- [ ] Kein Cloud-Konto und keine Telemetrie.
- [ ] Unit-, Integrations- und E2E-Tests sind grün.
- [ ] README und Sicherheitsmodell entsprechen dem Code.
- [ ] Eine fremde Person kann den Verständigungskreis ohne Handbuch bedienen.

## 21. Bewusst später

Nicht vor Abschluss des MVP bauen:

- weitere Agentenadapter
- Lern- oder Erinnerungsfunktion
- personenbezogene Profile
- Teamverwaltung
- Cloud-Synchronisation
- Gnom-Hub-, ThreadDesk-, Tollgate- oder 4AllPass-Anbindung
- Marketplace
- mobiles Produkt
- Autopilot
- allgemeine Shell-Freigabe
- Zahlungs- oder Nachrichtenaktionen
- Marketing-Seite
- Monetarisierung

Die Architektur darf spätere Adapter ermöglichen, aber kein späteres Produkt wird vorweggenommen.

## 22. Erster konkreter Arbeitsauftrag für die nächste KI

Beginne ausschließlich mit Etappe 0 und Etappe 1.

Erwartete Lieferung:

1. kurze Bestandsanalyse der vorhandenen Dateien,
2. eigenständig startbares TypeScript-Projekt,
3. reine Zustandsmaschine,
4. korrigierter Klarstellungsfluss,
5. exakte drei Signale,
6. Demo- und Manual-Adapter ohne Netzwerk,
7. minimales Fenster mit zwei klaren Gates,
8. vollständige Unit-Tests für alle Übergänge,
9. aktualisierte Startanleitung,
10. Bericht über Abweichungen zwischen altem Code und diesem Plan.

Noch nicht liefern:

- echte Grok-Build-Anbindung,
- allgemeine Schreib- oder Shell-Rechte,
- Tauri-Paket,
- weitere Agenten,
- neue Produktfunktionen.

Vor dem ersten Code-Commit muss die bauende KI in einem Satz bestätigen:

> Ich baue zuerst einen überprüfbaren Verständigungs- und Freigabekreis; ich behaupte keine echte Agentenverbindung und erteile keine realen Schreibrechte, bevor das technische Gate getestet ist.
