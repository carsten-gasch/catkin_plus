# catkin plus

## Inhalt

Nachdem mit Einführung von Catkin das TFG-Tool ersatzlos gestrichen wurde ist keine schnelle und einfache _Übersicht der Straßenzustellungen_ mehr vorhanden.
Die Erweiterung soll Catkin optisch so aufbereiten, dass man dennoch halbwegs vernünftig einen Überblick behält.

## Versionen

### 0.1.0 erster Versuch

- Leercontainer färben => blau
- Einfärbung nach Zustellzeit
  - Frühtermine (05:00 - 09:59) => grün
  - Mitteltermine (10:00 - 11:59) => gelb
  - Spättermine (12:00 - 19:59) => rot
- farbliche Markierung Auftrag vergeben / noch offen => grün / rot
- einfache Statistik in Fußzeile
  - Anzahl an Frühterminen, Mitteltermin, Spätterminen und Leercontainer

### 0.2.0 Datumsnavigation

- Einfügen von Schaltflächen zur schnellen Datumsnavigation
  - heute
  - vergangener Tag ("gestern" oder Freitag, wenn aktuelle Montag ist)
  - nächster Tag ("morgen" oder Montag, wenn aktuell Freitag ist)

### 0.3.0 Schnellfilter

- aktuelles Filterdatum und -suchwort wird im Titel angezeigt
- Schaltfläche um die Suche zu leeren

#### 0.3.1

- Update der readme

#### 0.3.2

- unify language => change CSS-Classes to english

#### 0.3.3

- button for resetting dates and times

## Ideen für zukünftige Versionen

- Optionen
  - Farben je Kategorie einstellbar
  - Zeiten für Terminkategorien einstellbar
- Suchleiste erweitern
  - beim Tippen highlight auf aktueller Seite
  - komplexere Suche
    - logische Verknüpfungen (und / oder / nicht)
