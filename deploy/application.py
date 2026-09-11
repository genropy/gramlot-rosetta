"""Production entry point; leave tutorial recipes and shared setup intact."""
import json
from pathlib import Path
from backend.app import create_app as create_rosetta


def create_app():
    app = create_rosetta()
    provenance = json.loads(Path('/app/runtime-provenance.json').read_text())

    @app.get('/health', include_in_schema=False)
    def health():
        return {'status': 'ok', 'application': 'gramlot-rosetta', 'runtime': provenance}

    return app
