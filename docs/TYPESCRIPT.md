# TypeScript für Wartbarkeit

Stand: 31. August 2026

Gilt für `src/lib/versteh-mir/`. CORE_PROTOCOL.md und BUILD_PLAN.md bleiben vorrangig für Verhalten und Sicherheit.

## 1. Ungültiges soll der Compiler ablehnen

String-Unions und discriminated Unions statt Booleans und magischer Strings.

- Signale sind `"weiss" | "unsicher" | "gar_nichts"`, nicht `string`.
- `Event`, `Effect`, `Loop` tragen ein `type`/`kind`. Neue Zweige müssen in `reduce` behandelt werden.
- `PlanningGrant.readOnly` und `ApprovalGrant.singleUse` sind Literal `true`, damit ein schreibendes Grant kein gültiger Typ ist.

Nicht zwei Felder dieselbe Geschichte erzählen lassen, wenn eines reicht. `phase` und `loop.kind` sind eine bekannte Doppelung — neue Zustände nur gemeinsam ändern.

## 2. An der Grenze prüfen, innen vertrauen

Unvertraut sind Adapterpläne, Freitext, JSON-Fixtures.

- Zod in `schema.ts` für Pläne und Grants.
- `capability` bleibt `string` am Plan: ein Adapter darf lügen. Der Broker lässt nur bekannte Fähigkeiten zu. Die Erklärung liest trotzdem `risk`.
- `unknown` nur dort. Kein `any`.

## 3. Erwartete Fehler sind Daten

`{ ok: true; … } | { ok: false; reason: string }` für Prüfung und Schema.

Nicht werfen, wenn ein Plan zu lang oder widersprüchlich ist. `throw` nur wenn der Adapter nachweislich nicht verbunden ist.

## 4. Zustand wird kopiert, nicht mutiert

`reduce` liefert immer ein neues `SessionState`. Dateien ändert nur der Broker, und nur mit Grant.

Kein stilles `state.phase = …`.

## 5. Eine Datei, eine Aufgabe

| Datei | Aufgabe |
|---|---|
| `types.ts` | Daten, keine Logik |
| `signals.ts` | Wörter des Menschen |
| `meaning.ts` | Spiegeln und Begriffe |
| `effects.ts` | Planwirkung und Prüfung |
| `engine.ts` | dünne Hülle dafür |
| `state.ts` | Sitzung bauen |
| `machine.ts` | Übergänge |
| `broker.ts` | Handlungstor |
| `adapters.ts` | unvertrauter Vorschlag |
| `session.ts` | einzige Fläche zur Oberfläche |

Keine zweite Orientierungs-Maschine neben `machine.ts`. Keine Ordner auf Vorrat.

## 6. Typen beschreiben Bedeutung

`satisfies` und annotierte Literale statt `as`. `as` nur an echten Grenzen (JSON, Browser-API).

IDs bleiben `string`. Keine Brand-Types, solange sie keine Verwechslung verhindern, die Tests nicht schon fangen.

Funktionen klein halten. Eine Funktion entscheidet oder führt aus, nicht beides — außer `applyEffect`, das absichtlich die Grenze zur Ausführung ist.
