# Sicherheitsmodell

Stand: 31. August 2026

Dieses Dokument leitet die Sicherheitsgrenze aus CORE_PROTOCOL.md und BUILD_PLAN.md ab. Es darf sie nicht abschwächen.

## Was vertraut wird

Nur der lokale Gate-Kern und der Capability Broker. Adapter, Modelle und freie Agententexte sind unvertraut.

Ein Adapter darf einen Plan vorschlagen. Er darf ihn nicht ausführen.

## Zwei Tore

1. **PlanningGrant** nach dem ersten weiß: nur angezeigtes Lesen im Testbereich. Keine Änderung, kein Löschen, kein Netz, keine Prozesse, keine Geheimnisse.
2. **ApprovalGrant** nach dem zweiten weiß: genau die Operationen des gehashten Plans, einmal, vor Ablauf, in derselben Sitzung.

Ohne das jeweils passende Tor geschieht nichts.

## Grant

Eine Handlungsfreigabe gilt nur, wenn alle Teile zusammenpassen:

- `sessionId` der laufenden Sitzung
- `planHash` des unveränderten Plans
- einmalige, zuvor ausgestellte `nonce`
- Ablaufzeit
- noch nicht verwendet

Der Broker berechnet den Hash aus der kanonischen Form des vollständigen Plans neu. Ein geänderter Plan, eine zusätzliche Operation oder ein anderes Ziel machen den Grant ungültig.

Ein Agent kann keine Freigabe erzeugen. Texte mit „weiß“ aus einem Plan oder einer KI-Antwort sind keine Freigabe.

## Testbereich

Im ersten Sicherheitsnachweis gibt es nur zwei Dateien: `README.md` und `PROJECT.md`.

Erlaubt: `read`, `noop`, `replace_sentence`, `write` auf genau diese Dateien.

Immer blockiert:

- zusätzliche Dateien oder Ziele
- Pfade mit `/`, `\`, `..` oder versteckte Namen
- Löschen
- Netz, Uploads, Shell
- Schlüssel und Geheimnisse
- Zahlungen
- destruktive, externe oder finanzielle Risiken

Der Arbeitsbereich liegt im Speicher, nicht im Dateisystem. Es gibt keine Symlinks und kein Elternverzeichnis. Dieselben Pfadregeln gelten trotzdem, damit ein späteres echtes Verzeichnis nicht offener wird.

Schlägt eine Operation fehl, wird der vorherige Stand wiederhergestellt. Die Nonce ist danach verbraucht.

## Neustart

`Von vorn` und `Stopp` beenden die Sitzung. Dateien kehren in den Ausgangsstand. Alte Grants gelten nicht mehr.

## Messung

Das Ergebnis nennt nur, was sich gegenüber dem Stand vor der Ausführung geändert hat. Eine freie Zusammenfassung des Adapters zählt nicht.

## Was dieses Dokument nicht erlaubt

Keine Browser-Cookies, keine fremden Sitzungen, kein Scraping, keine vorgetäuschte Grok-Build-Verbindung, keine allgemeine Schreib- oder Shell-Rechte.
