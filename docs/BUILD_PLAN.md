# Versteh-Mir – verbindlicher Bauplan

Stand: 30. August 2026  
Repo: https://github.com/landjunge/versteh-mir  
Status: verbindliche technische Roadmap für die nächste Implementierung

Dokumentenhierarchie:

1. docs/CORE_PROTOCOL.md ist verbindlich für Produktverhalten, Nutzerfluss, Bedeutungsaufbau und Freigabegrenzen.
2. Dieses Dokument ist verbindlich für technische Architektur, Arbeitsetappen und Abnahmereihenfolge.
3. docs/IDEA.md, docs/BRAINSTORM.md und docs/PLAN.md dokumentieren Ursprung und frühere Entwürfe.

Bei einem Widerspruch gewinnt für das Verhalten CORE_PROTOCOL.md und für die technische Sicherheitsgrenze jeweils die strengere Regel.

## 0. Auftrag an die bauende KI

Lies vor jeder Änderung in dieser Reihenfolge:

1. README.md
2. docs/CORE_PROTOCOL.md vollständig
3. docs/IDEA.md
4. docs/BRAINSTORM.md
5. docs/PLAN.md als historischen Entwurf
6. dieses Dokument vollständig
7. den vorhandenen Quellcode und alle Tests

Arbeite danach ausschließlich etappenweise. Eine Etappe wird vollständig getestet und dokumentiert, bevor die nächste beginnt.

Verbindliche Regeln:

- CORE_PROTOCOL.md nicht verkürzen, umgehen oder als bloße Empfehlung behandeln.
- Orientierung, Erkundung, Spiegelung und Erklärung als Strategien derselben Understanding Loop bauen, nicht als getrennte Produkte oder vom Menschen zu wählende Modi.
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

## 1.1 Das Abholprinzip

Versteh-Mir setzt keinen fertigen Plan, kein technisches Vokabular und kein Mindestwissen voraus.

Der Mensch darf mit einem klaren Auftrag beginnen. Er darf aber ebenso sagen:

- „Ich habe keinen Plan.“
- „Ich weiß nicht, wo ich anfangen soll.“
- „Irgendetwas stimmt nicht.“
- „Ich kann gerade nicht mehr folgen.“
- nur ein einzelnes Wort, ein Gefühl oder eine unvollständige Beobachtung.

Das ist kein fehlerhafter Prompt. Genau dort beginnt die Unterstützung.

Verbindlicher Grundsatz:

> Versteh-Mir geht so viele Ebenen zurück, wie dieser einzelne Mensch es braucht, und versucht ihn dort abzuholen, wo er tatsächlich steht – nicht dort, wo ein durchschnittlicher Nutzer stehen müsste.

Dabei gelten folgende Regeln:

- Wissen, Ziel, Fähigkeiten, Belastbarkeit und gewünschte Sprachebene werden nie aus Alter, Beruf, Rechtschreibung, Ausdruck oder bisheriger Erfahrung vermutet.
- Als bekannt gilt nur, was der Mensch ausdrücklich gesagt oder nach sichtbarer, freigegebener Untersuchung bestätigt hat.
- Vermutungen werden getrennt als unbestätigte Möglichkeiten gekennzeichnet.
- Die KI verwendet zuerst die eigenen Wörter des Menschen.
- Pro Schritt wird nur eine Frage, ein Begriff oder eine Entscheidung behandelt.
- unsicher führt zu einer konkreteren Frage auf derselben Ebene.
- gar nichts führt eine Ebene zurück: einfachere Wörter, ein Beispiel, ein Vergleich oder eine andere Darstellungsform.
- Dieselbe Erklärung wird nicht nur länger wiederholt. Wenn sie nicht ankommt, wird der Zugang gewechselt.
- „Ich weiß es nicht“ ist eine vollständige und zulässige Antwort.
- Wenn der Mensch keine Antwort geben kann, darf Versteh-Mir einen kleinen, sicheren und umkehrbaren Orientierungsschritt vorschlagen.
- Das Tempo bestimmt der Mensch durch seine Signale. Schnelle Zustimmung ist kein Erfolgsmaß.
- Zurückgehen ist kein Scheitern, sondern Teil des Produkts.
- Der Mensch wird nicht geprüft, bewertet, gedrängt oder bevormundet.
- Wenn Versteh-Mir den Menschen trotz verschiedener Versuche nicht erreicht, sagt es das offen und bietet Pause, eine andere Darstellung oder menschliche Hilfe an.
- Eine persönliche Anpassung gilt für die aktuelle Verständigung. Es entsteht kein dauerhaftes Personenprofil ohne ausdrückliche Zustimmung.

Ziel ist nicht, den Menschen möglichst schnell zu einem weiß zu bringen. Ziel ist, einen nächsten Satz zu finden, den genau dieser Mensch ehrlich verstehen und beurteilen kann.

## 1.2 Ungewöhnliche Denkwege bewahren

Menschen denken nicht immer linear. Eine Idee kann als Bild, Sprung, Widerspruch, Metapher, einzelnes Wort oder Verbindung zwischen scheinbar fremden Bereichen beginnen. Auf den ersten Blick kann sie unlogisch oder absurd wirken. Ihre innere Struktur kann erst nach mehreren Schritten sichtbar werden.

Versteh-Mir darf solche Gedanken weder vorschnell verwerfen noch vorschnell als genial bestätigen.

Verbindlicher Grundsatz:

> Das zunächst Unverständliche bleibt offen, bis der Mensch seine Verbindung zeigen konnte. Die KI hilft beim Freilegen der Struktur, ohne sie für ihn zu erfinden.

Daraus folgen diese Regeln:

- Die ursprünglichen Wörter und Fragmente des Menschen bleiben unverändert erhalten.
- Eine ungewöhnliche Aussage wird nicht automatisch in eine gewöhnliche Standardlösung umgeschrieben.
- Die KI fragt nach Beziehungen: „Was verbindet A und B für dich?“
- Eine vom Menschen genannte Beziehung wird als seine Aussage gespeichert.
- Eine von der KI vermutete Beziehung bleibt ausdrücklich eine unbestätigte Hypothese.
- Bestätigung und Ablehnung verändern nicht rückwirkend die ursprüngliche Aussage.
- Widersprüchliche Fragmente dürfen zunächst nebeneinander bestehen.
- Kohärenz muss nicht innerhalb einer einzelnen Antwort entstehen.
- Wiederkehrende Begriffe oder Beziehungen dürfen als mögliches Muster gezeigt werden, aber nur mit einer Bestätigungsfrage.
- Die KI darf kleine Beispiele, Gegenbeispiele oder sichere Gedankenexperimente anbieten, um eine Beziehung prüfbar zu machen.
- Erst bestätigte Beziehungen dürfen eine Spezifikation oder Handlung begründen.
- Das System bewertet den Menschen nicht als logisch, unlogisch, begabt, krank, genial oder verwirrt.
- Es entsteht keine psychologische Diagnose und kein dauerhaftes Denkprofil.
- Die Bedeutungslandkarte gehört nur zur aktuellen Aufgabe oder Sitzung, sofern der Mensch keine Speicherung verlangt.

Der Erfolg besteht nicht darin, jede ungewöhnliche Idee als richtig zu erklären. Der Erfolg besteht darin, sie lange genug unverfälscht zu halten, damit ihre mögliche Struktur gemeinsam geprüft werden kann.

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
15. Ein fertiger Plan oder ein Mindestwissen ist niemals Voraussetzung.
16. Versteh-Mir beginnt beim individuellen Menschen und geht bei Bedarf beliebig viele Verständnisebenen zurück.
17. Wissen und Absichten werden nicht vermutet; Fakten und Hypothesen bleiben getrennt.
18. „Ich weiß es nicht“ wird angenommen und löst keinen erfundenen Plan aus.
19. Die Sprache passt sich anhand ausdrücklicher Signale und Aussagen an, nicht anhand eines vermuteten Nutzerprofils.
20. Wenn keine Verständigung gelingt, wird die Grenze offen benannt statt Zustimmung zu erzeugen.
21. Ungewöhnliche, nichtlineare oder zunächst widersprüchliche Gedanken werden bewahrt, bevor sie bewertet oder normalisiert werden.
22. Die Originalworte des Menschen werden nie durch eine KI-Interpretation überschrieben.
23. Beziehungen und Muster bleiben Hypothesen, bis der Mensch sie bestätigt.
24. Nur bestätigte Bedeutungsbeziehungen dürfen einen Plan begründen.
25. Versteh-Mir erstellt keine psychologische Diagnose und bewertet weder Intelligenz noch Genialität.

## 3. Was der erste nutzbare Stand leisten muss

Der erste nutzbare Stand, im Folgenden MVP genannt, beherrscht einen vollständigen Kreis:

1. Der Mensch spricht oder tippt, was er gerade sagen kann: Wunsch, Problem, Beobachtung, Gefühl, einzelnes Wort oder „Ich habe keinen Plan“.
2. Versteh-Mir speichert die ursprünglichen Wörter und trennt Bekanntes, Unbekanntes und unbestätigte Möglichkeiten.
3. Reicht das Gesagte noch nicht für einen prüfbaren Wunsch, beginnt der Orientierungsmodus.
4. Enthält das Gesagte ungewöhnliche, nichtlineare oder noch unverbundene Fragmente, darf daraus ein Erkundungsmodus entstehen.
5. Versteh-Mir spiegelt nur die kleinste sicher bekannte Aussage oder Beziehung.
6. Der Mensch reagiert mit weiß, unsicher oder gar nichts.
7. Bei unsicher wird genau eine gezielte Frage gestellt.
8. Die freie Antwort auf diese Frage wird angenommen und der Stand wird neu gespiegelt.
9. Bei gar nichts wird genau ein benannter Begriff erklärt oder eine Verständnisebene zurückgegangen.
10. Bei „Ich weiß es nicht“ wechselt Versteh-Mir die Frage oder Darstellungsform, ohne eine Antwort zu erfinden.
11. Eine ungewöhnliche Verbindung bleibt offen, bis der Mensch sie bestätigt, ablehnt oder weiter erklärt.
12. Sobald ein kleiner, ehrlicher und prüfbarer nächster Zweck gefunden ist, wird daraus die Bedeutungsfassung für Gate 1.
13. Beim ersten weiß erhält der Agent nur die Erlaubnis, einen Plan zu erstellen. Er darf noch nichts verändern.
14. Der Agent liefert einen strukturierten Plan.
15. Versteh-Mir erklärt die konkrete Wirkung dieses Plans in der Sprache dieses Menschen.
16. Der Mensch reagiert erneut mit weiß, unsicher oder gar nichts.
17. Nur das zweite weiß erzeugt eine einmalige technische Ausführungsfreigabe.
18. Der Capability Broker führt nur die exakt genehmigten Operationen aus.
19. Versteh-Mir zeigt anschließend verständlich, was tatsächlich passiert ist.

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

### Stufe 0: Den Menschen abholen

Diese Stufe beginnt, wenn der Mensch noch keinen prüfbaren Wunsch formulieren kann oder ausdrücklich sagt, dass er keinen Plan hat.

Versteh-Mir fordert dann keine Spezifikation. Es hält zunächst nur fest:

- welche Wörter der Mensch selbst benutzt hat,
- was dadurch sicher bekannt ist,
- was weiterhin unbekannt ist,
- welche Möglichkeiten höchstens als unbestätigte Hypothesen denkbar sind.

Die erste Rückmeldung enthält nur die kleinste belegte Wahrheit.

Beispiel:

> Du weißt gerade noch nicht, welcher Weg richtig ist, möchtest aber nicht allein an diesem Punkt stehen bleiben. Stimmt das?

Nach weiß folgt genau eine Frage, die an den eigenen Worten des Menschen ansetzt. Mögliche Formen sind:

- „Was soll nicht so bleiben wie jetzt?“
- „Woran merkst du, dass es gerade nicht weitergeht?“
- „Was wäre eine kleine Verbesserung?“
- „Soll ich zuerst nur den aktuellen Stand ansehen und noch nichts verändern?“

Diese Sätze sind Beispiele, keine feste Frageliste. Die konkrete Frage muss aus dem aktuellen Gespräch hervorgehen.

Kann der Mensch auch diese Frage nicht beantworten:

1. wird die fehlende Antwort akzeptiert,
2. wird eine Ebene zurückgegangen,
3. wird die Darstellungsform gewechselt,
4. wird höchstens ein kleiner, sicherer Orientierungsschritt angeboten,
5. bleibt jede technische Handlung gesperrt.

Ein Orientierungsschritt kann selbst der erste prüfbare Wunsch werden:

> Du willst noch keine Lösung auswählen; ich soll zunächst nur den freigegebenen Bereich lesen und dir genau eine mögliche nächste Richtung erklären. Stimmt das?

Erst dieses weiß darf den klar genannten, schreibgeschützten Leseschritt erlauben.

Die Abholschleife endet nicht nach einer festen Zahl von Fragen. Sie endet, wenn:

- ein ehrlicher, kleiner nächster Zweck gefunden wurde,
- der Mensch pausieren oder abbrechen möchte,
- eine andere Darstellung gewünscht wird,
- oder Versteh-Mir offen feststellen muss, dass es den Menschen gerade nicht erreicht.

Versteh-Mir darf niemals Müdigkeit, Verwirrung oder wiederholtes „Ich weiß es nicht“ ausnutzen, um eine eigene Empfehlung als menschliche Entscheidung auszugeben.

### Stufe 0b: Den persönlichen Denkweg erkunden

Diese Stufe ist für Gedanken, deren Verbindung noch nicht in einer linearen Erklärung sichtbar ist.

Beispiel:

> Der Tresor ist wie ein Container, aber vielleicht müssen Tresore miteinander reden und später eine Identität haben.

Versteh-Mir macht daraus nicht sofort eine bekannte Standardarchitektur. Es zerlegt die Aussage zunächst ohne Verlust:

- Tresor und Container wurden vom Menschen verbunden.
- Mehrere Tresore und Kommunikation wurden verbunden.
- Identität wurde als späterer Gedanke genannt.
- Wie diese Beziehungen genau gemeint sind, ist noch offen.

Die nächste Frage behandelt nur eine Verbindung:

> Was ist für dich bei Tresor und Container gleich?

Oder:

> Warum braucht ein Tresor in deiner Vorstellung eine eigene Identität?

Der Ablauf:

1. Originalfragment unverändert bewahren.
2. Begriffe als Knoten der aktuellen Bedeutungslandkarte anlegen.
3. Nur ausdrücklich genannte Beziehungen als bestätigt eintragen.
4. KI-Vermutungen als offene Hypothesen markieren.
5. Genau eine Beziehung spiegeln oder erfragen.
6. weiß bestätigt nur diese Beziehung.
7. unsicher hält sie offen und fragt konkreter.
8. gar nichts erklärt einen Begriff oder wechselt die Darstellung.
9. Spätere Aussagen dürfen frühere Fragmente verbinden, ohne deren Ursprung zu löschen.
10. Erst ein bestätigter Teil der Landkarte darf in IntentSpec überführt werden.

Die Bedeutungslandkarte ist kein Diagramm, das der Mensch bedienen muss. Sie ist ein internes Gedächtnis der aktuellen Verständigung. Die Oberfläche zeigt weiterhin nur einen Satz, eine Beziehung oder eine Frage.

Wenn sich keine tragfähige Verbindung zeigt, bleibt die Idee offen. Versteh-Mir nennt sie weder Unsinn noch Durchbruch.

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

Normativ gilt docs/CORE_PROTOCOL.md: orienting und exploring sind interne Strategien beziehungsweise Subzustände derselben Understanding Loop. Sie erscheinen nicht als wählbare Produktmodi. Die folgenden Namen dürfen intern im Reducer verwendet werden, solange dieselbe öffentliche Zustandsmaschine, Oberfläche und Sicherheitslogik alle Ausgangslagen trägt.

| Zustand | Erlaubte Eingabe | Nächster Zustand | Seiteneffekt |
|---|---|---|---|
| idle | beliebige menschliche Aussage | orienting, exploring oder review_intent | Originalworte erfassen; noch keinen Agenten aufrufen |
| orienting | freie menschliche Antwort | orienting, exploring oder review_intent | Bekanntes und Unbekanntes aktualisieren; höchstens eine Frage stellen |
| exploring | neues Fragment oder erklärte Beziehung | exploring oder review_intent | Original bewahren; genau eine Beziehung ergänzen oder prüfen |
| exploring | weiß | exploring oder review_intent | nur die aktuell gezeigte Beziehung bestätigen |
| exploring | unsicher | exploring | Beziehung offenhalten und genau eine konkretere Frage stellen |
| exploring | gar nichts | exploring | einen Begriff erklären oder dieselbe Beziehung anders darstellen |
| exploring | spätere Verbindung | exploring | neue bestätigte Kante ergänzen; frühere Fragmente nicht überschreiben |
| orienting | weiß | orienting oder review_intent | nur den aktuellen kleinen Sinnschritt bestätigen |
| orienting | unsicher | orienting | an den eigenen Worten ansetzen und eine konkretere Frage stellen |
| orienting | gar nichts | orienting | einen benannten Begriff erklären oder eine Ebene zurückgehen |
| orienting | „Ich weiß es nicht“ oder keine Antwort | orienting | Antwort akzeptieren, Zugang wechseln oder sicheren Orientierungsschritt anbieten |
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

type GroundedFact = {
  value: string;
  source: "human" | "approved_observation";
  evidence: string;
};

type LabeledHypothesis = {
  value: string;
  confirmed: false;
};

type MeaningNode = {
  id: string;
  label: string;
  originalQuote: string;
  status: "expressed" | "confirmed" | "open";
};

type MeaningEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
  origin: "human" | "ai_hypothesis";
  evidence: string | null;
  status: "open" | "confirmed" | "rejected";
};

type MeaningMap = {
  sessionId: string;
  nodes: MeaningNode[];
  edges: MeaningEdge[];
};

type OrientationState = {
  originalWords: string[];
  knownFacts: GroundedFact[];
  unknowns: string[];
  hypotheses: LabeledHypothesis[];
  meaningMap: MeaningMap;
  currentReflection: string;
  currentQuestion: string | null;
  representationHistory: Array<"plain" | "example" | "comparison" | "visual">;
};

type IntentSpec = {
  id: string;
  revision: number;
  originalText: string;
  knownFacts: GroundedFact[];
  hypotheses: LabeledHypothesis[];
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
- Jeder bekannte Fakt besitzt eine Herkunft und einen belegenden Ausschnitt.
- Hypothesen bleiben sichtbar unbestätigt und dürfen keine Handlung begründen.
- MeaningNode bewahrt das Originalzitat; eine spätere Interpretation ersetzt es nicht.
- Eine MeaningEdge mit origin ai_hypothesis darf erst nach menschlicher Bestätigung den Status confirmed erhalten.
- Abgelehnte Beziehungen bleiben für die aktuelle Nachvollziehbarkeit markiert, begründen aber keine Spezifikation.
- Nur der bestätigte Teil der sitzungsgebundenen MeaningMap darf in IntentSpec einfließen.
- representationHistory beschreibt nur bereits versuchte Darstellungsformen; es ist keine Bewertung oder Rangfolge des Menschen.
- Aus Ausdruck, Rechtschreibung oder Antworttempo wird kein Fähigkeitsprofil berechnet.
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
  startOrientation(input: string): Promise<OrientationState>;
  continueOrientation(
    state: OrientationState,
    answer: string
  ): Promise<OrientationState | IntentSpec>;
  stepBack(
    state: OrientationState,
    reason: "unsicher" | "gar_nichts" | "keine_antwort"
  ): Promise<OrientationState>;
  exploreConnection(
    map: MeaningMap,
    input: string
  ): Promise<MeaningMap>;
  proposePattern(
    map: MeaningMap
  ): Promise<{ relation: MeaningEdge; question: string } | null>;
  confirmConnection(
    map: MeaningMap,
    edgeId: string,
    signal: Signal
  ): Promise<MeaningMap>;
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

- Der individuelle Ausgangspunkt wird aus ausdrücklichen Aussagen und Signalen aufgebaut, nicht aus vermuteten persönlichen Eigenschaften.
- Die Engine muss bekannte Fakten, Unbekanntes und Hypothesen getrennt ausgeben.
- Sie bewahrt ungewöhnliche Fragmente und Beziehungen, auch wenn noch keine lineare Bedeutung erkennbar ist.
- Sie darf wiederkehrende Muster nur als bestätigungspflichtige Hypothese zeigen.
- Sie erzeugt keine Bewertung der Intelligenz, Persönlichkeit oder psychischen Verfassung.
- Sie beginnt mit den Wörtern des Menschen und verändert pro Schritt nur so viel wie nötig.
- Bei wiederholtem Nichtverstehen wechselt sie Darstellungsform oder geht konzeptuell zurück.
- Sie optimiert nicht auf schnelle Zustimmung.
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
    CORE_PROTOCOL.md
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

- SharedUnderstanding, UnderstandingAtom und Provenienztypen aus CORE_PROTOCOL.md implementieren.
- eine gemeinsame Understanding Loop mit deterministischer Next-Step-Policy implementieren.
- Zustandsmaschine aus Abschnitt 6 implementieren.
- Orientierungsmodus und Abholschleife als interne Strategie vor Gate 1 implementieren.
- Erkundungsmodus für ungewöhnliche und nichtlineare Gedanken als zweite interne Strategie implementieren.
- keine Strategieauswahl oder Nutzerklassifikation in die UI aufnehmen.
- sitzungsgebundene MeaningMap mit Originalzitaten, belegten Beziehungen und KI-Hypothesen implementieren.
- die vier Golden Journeys als maschinenlesbare Fixtures clear-intent, no-plan, nonlinear-idea und cannot-follow anlegen.
- alle vier Fixtures durch dieselbe öffentliche State Machine und UI laufen lassen.
- bekannte Fakten, Unbekanntes und gekennzeichnete Hypothesen getrennt halten.
- Eingaben wie „Ich habe keinen Plan“ und „Ich weiß es nicht“ als gültige Zustände verarbeiten.
- eine Ebene zurückgehen und die Darstellungsform wechseln können.
- Freie Antwort nach unsicher korrekt verarbeiten.
- Begriff nach gar nichts benennen lassen.
- Exakte Signale durchsetzen.
- Intent-Revisionen einführen.
- Demo- und Manual-Adapter ergänzen.
- UI zeigt Gate 1 und Gate 2 eindeutig.
- Agententext kann kein menschliches Signal auslösen.

Abnahme:

- Die vier Golden Journeys aus CORE_PROTOCOL.md laufen reproduzierbar durch dieselbe Understanding Loop.
- Es gibt keinen sichtbaren Anfänger-, Orientierungs- oder Ideenmodus.
- Die Next-Step-Policy und nicht ein freier Modelltext wählt die nächste Prozessaktion.
- Ein Mensch kann ohne Ziel oder Plan beginnen und wird schrittweise zu einem kleinen prüfbaren nächsten Zweck geführt.
- Ungewöhnliche Fragmente bleiben erhalten und können über mehrere Schritte zu einer bestätigten Beziehung verbunden werden.
- Eine KI-Hypothese kann ohne menschliche Bestätigung nicht in IntentSpec gelangen.
- Kein Ziel, Wissen oder Motiv wird ohne Beleg in IntentSpec übernommen.
- Wiederholtes Nichtwissen erzeugt weder Druck noch einen erfundenen Plan.
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

Die vier Golden-Journey-Fixtures aus docs/CORE_PROTOCOL.md sind die oberste Ende-zu-Ende-Referenz. Die folgenden Tests ergänzen sie und dürfen ihre Invarianten nicht abschwächen.

Mindestens folgende Fälle müssen automatisiert geprüft werden:

### Orientierung und individuelles Abholen

- „Ich habe keinen Plan“ ist eine gültige Eingabe und kein Fehler.
- Ein unbekanntes Ziel bleibt unbekannt, bis der Mensch es bestätigt.
- Die KI übernimmt keine Vermutung als bekannten Fakt.
- Jeder bekannte Fakt verweist auf eine menschliche Aussage oder freigegebene Beobachtung.
- Rechtschreibung, Beruf, Alter oder kurze Antworten erzeugen keine Wissensannahme.
- „Ich weiß es nicht“ wird akzeptiert und nicht als Zustimmung interpretiert.
- Nach unsicher wird nur eine Frage gestellt.
- Nach gar nichts wird ein Begriff erklärt oder eine Ebene zurückgegangen.
- Bei wiederholtem Nichtverstehen wird die Darstellung gewechselt statt nur verlängert.
- Ein sicherer Orientierungsschritt ist lesend, begrenzt und selbst Gegenstand eines weiß.
- Der Mensch kann jederzeit pausieren oder abbrechen.
- Wenn keine Verständigung gelingt, behauptet das System keinen Erfolg.
- Nichtlineare Fragmente werden nicht automatisch in eine Standardlösung umgeschrieben.
- Originalzitate bleiben bei späteren Interpretationen erhalten.
- Eine Beziehung zwischen zwei Begriffen wird nicht ohne menschlichen Beleg als Fakt gespeichert.
- Wiederkehrende Muster werden als Frage gezeigt, nicht als Diagnose.
- Eine abgelehnte KI-Hypothese begründet keine Spezifikation.
- Ein später bestätigter Zusammenhang darf frühere Fragmente verbinden.
- Das System vergibt keine Labels wie unlogisch, genial, krank oder verwirrt.
- Die MeaningMap bleibt auf die aktuelle Sitzung oder Aufgabe begrenzt.

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

- Kein Plan → Abholschleife → kleiner Orientierungszweck → weiß → lesender Plan.
- Wiederholt „Ich weiß es nicht“ → andere Darstellung → keine erfundene Entscheidung.
- Einzelnes Alltagswort → Spiegelung → eine Frage → prüfbarer Wunsch.
- Unverbundene Fragmente → Beziehungsfrage → bestätigte MeaningMap → kleiner prüfbarer Zweck.
- KI vermutet ein Muster → Mensch sagt unsicher → Muster bleibt offen und löst keine Planung aus.
- Spätere Erklärung verbindet frühe Fragmente → Originale bleiben nachvollziehbar.
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
- [ ] Alle vier Golden Journeys nutzen dieselbe Oberfläche, State Machine und Sicherheitslogik.
- [ ] Understanding Loop und Next-Step-Policy entsprechen CORE_PROTOCOL.md.
- [ ] Ein Mensch kann ohne Plan, Fachwort oder fertiges Ziel beginnen.
- [ ] Die Abholschleife geht individuell zurück, ohne Wissen oder Absicht zu vermuten.
- [ ] Ungewöhnliche Denkwege werden erkundet, ohne sie vorschnell zu normalisieren oder zu bewerten.
- [ ] Originalfragmente und bestätigte Beziehungen bleiben nachvollziehbar.
- [ ] Nur vom Menschen bestätigte Beziehungen dürfen eine Handlung begründen.
- [ ] Bekannte Fakten, Unbekanntes und Hypothesen bleiben getrennt.
- [ ] „Ich weiß es nicht“ ist ein funktionierender Pfad und keine Sackgasse.
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
3. SharedUnderstanding, UnderstandingAtom und Provenienztypen,
4. gemeinsame Understanding Loop mit deterministischer Next-Step-Policy,
5. vier maschinenlesbare Golden-Journey-Fixtures,
6. reine Zustandsmaschine,
7. Orientierungsstrategie mit individueller Abholschleife,
8. Erkundungsstrategie mit sitzungsgebundener MeaningMap,
9. Originalzitate, belegte Beziehungen und getrennte KI-Hypothesen,
10. belegte Trennung von bekannten Fakten, Unbekanntem und Hypothesen,
11. korrigierter Klarstellungsfluss,
12. exakte drei Signale,
13. Demo- und Manual-Adapter ohne Netzwerk,
14. ein minimales Fenster für alle Ausgangslagen und zwei klare Gates,
15. vollständige Unit-Tests für alle Übergänge,
16. aktualisierte Startanleitung,
17. Bericht über Abweichungen zwischen vorhandenem Code, CORE_PROTOCOL.md und diesem Plan.

Noch nicht liefern:

- echte Grok-Build-Anbindung,
- allgemeine Schreib- oder Shell-Rechte,
- Tauri-Paket,
- weitere Agenten,
- neue Produktfunktionen.

Vor dem ersten Code-Commit muss die bauende KI in einem Satz bestätigen:

> Ich baue zuerst einen überprüfbaren Verständigungs- und Freigabekreis; ich behaupte keine echte Agentenverbindung und erteile keine realen Schreibrechte, bevor das technische Gate getestet ist.
