# PPTX Methoden Importer

Lokaler Mini-Prototyp zum Hochladen und Auslesen von `.pptx` Dateien.

## Start

```bash
cd pptx_importer_app
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Dann öffnen:

```text
http://127.0.0.1:8000
```

## Was wird ausgelesen?

- Folienanzahl
- Folientitel-Vorschlag
- Texte pro Folie
- Bullet-/Schlüsselelemente
- Speaker Notes, falls vorhanden
- Keywords
- Bildanzahl pro Folie
- einfacher Methoden-Vorschlag mit Kategorien und Tags
