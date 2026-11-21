# 021_BUERO – Journal mit mehreren Artikeln

## Einen neuen Journaleintrag veröffentlichen

1. Unter `media/` einen neuen Ordner erstellen, z. B. `neuer-artikel` (nur Kleinbuchstaben, Zahlen und Bindestriche).
2. In diesem Ordner `artikel_de.md` und `artikel_en.md` erstellen. Du kannst die Dateien aus `labor-laurenzentorgasse` kopieren und deren Inhalt ersetzen.
3. Die Artikelbilder in denselben Ordner legen. Beispiel im Markdown: `![Beschreibung](bild_01.jpg)`; direkt darunter: `*Bildunterschrift. © 021_BUERO.*`.
4. In `journal.json` im Array `articles` ein weiteres Objekt ergänzen. Beispiel:

```json
{
  "id": "neuer-artikel",
  "title": "Neuer Artikel",
  "date": "2026-11-16"
}
```

**Wichtig:** Zwischen den Objekten steht ein Komma; hinter dem letzten Objekt keines. `id` muss exakt dem Ordnernamen entsprechen. Datum: `JJJJ-MM-TT`. Die Webseite sortiert automatisch nach Datum absteigend. Bei gleichem Datum bleibt die Reihenfolge in der Liste erhalten.

5. Lokal testen: Terminal im Hauptordner öffnen und `python3 -m http.server 8000` ausführen. Im Browser `http://localhost:8000` öffnen. Bei bereits belegtem Port z. B. `8001` verwenden.
6. Wenn alles stimmt, die geänderten Dateien zu GitHub hochladen. `journal.json`, die beiden Markdown-Dateien und Bilder müssen mit hochgeladen werden.

## Was passiert automatisch?

- Neue Artikel erscheinen zuoberst, wenn sie das neueste Datum haben.
- Das Journal-Untermenü wird automatisch aus `journal.json` erstellt.
- Jeder Eintrag hat einen Direktlink `#article-ORDNERNAME`.
- DE/EN lädt alle Artikel in der gewählten Sprache.
- Die bestehenden Menüs, das Startbild und die übrige Gestaltung bleiben erhalten.

## Hinweise

- Die Markdown-Anzeige unterstützt absichtlich nur Absätze, Bilder und direkt folgende Bildunterschriften. Überschriften mit `# ` werden ignoriert. Es ist kein vollständiger Markdown-Renderer.
- Das JSON-Datum und der Titel stehen zentral in `journal.json` und werden für beide Sprachen gleich angezeigt.
- Ein Artikel muss beide Sprachdateien haben. Fehlende Dateien werden im Artikel als Fehler angezeigt, ohne die restlichen Artikel zu blockieren.
- Bilder und Videos aus der hochgeladenen Webseite sind im Paket enthalten. Der doppelte, ungenutzte Ordner `media/021_BUERO/` wurde nicht übernommen.
- Änderungen an HTML/CSS/JS bitte zunächst lokal testen und vor dem Hochladen eine Sicherung behalten.
