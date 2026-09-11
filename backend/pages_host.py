"""Use Gramlot's FastAPI adapter; Rosetta owns only its JS laboratory shell."""
import json
from pathlib import Path

from fastapi import HTTPException
from fastapi.responses import HTMLResponse
from backend.examples import EXAMPLES
from fastapi.staticfiles import StaticFiles
from gramlot.contrib.fastapi import mount_gramlot


class PagesHost:
    def __init__(self, root):
        self.root = Path(root)

    def mount(self, app):
        self.pages = mount_gramlot(app, directory=self.root / 'frontends/pages',
                                   prefix='/examples/pages', title='Gramlot Python')
        app.add_api_route('/examples/pages-js/{example}/', self.js_index,
                          include_in_schema=False)
        app.mount('/gramlot-js', StaticFiles(directory=self.root / 'frontends/pages-js'))

    def js_index(self, example: str):
        if example not in EXAMPLES:
            raise HTTPException(404, "Unknown example.")
        imports = self.pages.runtime.import_map()
        template = (self.root / 'frontends/pages-js/index.html').read_text().replace('__TITLE__', EXAMPLES[example])
        return HTMLResponse(template.replace('__IMPORTS__',
                            json.dumps({'imports': imports}).replace('<', r'\u003c')))
