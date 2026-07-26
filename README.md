# 🦇 Fettschmelzer

**Koalition der Willigen** – ein spielerischer Gewichts-Tracker fürs Handy, installierbar als echte App (PWA).

Trag dein Ziel ein, wieg dich (mehr oder minder) täglich und lass dir die Veränderung
von einem viel zu engen Fledermaus-Kostüm um die Ohren hauen. Jede Messung wird durch
einen skurrilen Gegenstand dargestellt, dessen Gewicht der Veränderung seit der letzten
Wiegung entspricht – grün, wenn's Richtung Ziel geht, rot, wenn nicht.

## Features

- 🎯 Start- und Zielgewicht festlegen, Fortschrittsbalken bis zum Ziel
- 🦇 Skurriler Eyecatcher: die Veränderung als kurioser Gegenstand (Socke bis Baby-Beluga), 100-g-Skala
- ✅ Richtung Ziel = grün & motivierend, weg vom Ziel = rot
- 📊 Gewicht (kg), Fett (%) und Wasser (%) je Messung
- 🕒 Datum & Uhrzeit werden automatisch gesetzt
- 📈 Liniendiagramm mit allen drei Werten, einzeln ein-/ausblendbar
- 📜 Verlauf mit Tagesdifferenz, Einträge löschbar
- 📲 Installierbar als echte App, funktioniert offline
- 🔒 Alle Daten bleiben lokal auf dem Gerät

## ⚠️ Wichtig: Warum „nur ein Link" statt echter App?

Eine PWA wird von Android/Chrome **nur dann** als echte App (im Vollbild, mit eigenem
Eintrag in der App-Liste) installiert, wenn **alle** diese Bedingungen erfüllt sind:

1. Die Seite läuft über **`https://`** (oder `http://localhost` zum Testen) –
   **nicht** über `file://` (also nicht per Doppelklick auf die Datei!).
2. Ein **Service Worker** ist registriert (macht `sw.js`).
3. Ein gültiges **Manifest** mit Icons ist verlinkt (macht `manifest.json`).

Fehlt eine davon, bietet Chrome nur „Zum Startbildschirm hinzufügen" an – das
erzeugt bloß eine **Verknüpfung** (den Link, den du gesehen hast), keine echte App.

**Lösung:** Die App über HTTPS bereitstellen. Am einfachsten kostenlos mit GitHub Pages (siehe unten).

## Kostenlos veröffentlichen mit GitHub Pages

1. Neues Repo auf GitHub anlegen, z. B. `fettschmelzer`.
2. Diese Dateien hochladen (per Web-Upload oder Git, siehe unten).
3. Auf GitHub: **Settings → Pages**.
4. Unter **Branch** `main` und Ordner `/ (root)` wählen, **Save**.
5. Nach 1–2 Minuten läuft die App unter
   `https://<dein-user>.github.io/fettschmelzer/`
6. Diese URL in **Chrome auf dem Handy** öffnen. Es erscheint automatisch der
   Balken **„Fettschmelzer installieren"** – antippen. (Oder Menü ⋮ → „App installieren".)
7. Fertig – die App liegt mit Batman-Icon auf dem Startbildschirm und startet im Vollbild.

## Git-Setup

```bash
git init
git add .
git commit -m "Fettschmelzer"
git branch -M main
git remote add origin https://github.com/<dein-user>/fettschmelzer.git
git push -u origin main
```

## Lokal testen (am Rechner)

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```
Über `localhost` funktioniert die Installation ebenfalls (zum Ausprobieren).

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Oberfläche, Logo eingebettet, Install-Logik, SW-Registrierung |
| `app.js` | Logik: Messungen, Objekt-Auswahl, Diagramm, Speicherung |
| `sw.js` | Service Worker (Offline-Betrieb, Voraussetzung für Installation) |
| `manifest.json` | PWA-Manifest (Name, Farben, Icons) |
| `icons/` | App-Icons in allen Größen + maskable + apple-touch |
| `make_icons.py` | Skript zum Neu-Erzeugen der Icons (benötigt Pillow) |

## Lizenz

MIT – siehe [LICENSE](LICENSE).
