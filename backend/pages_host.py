"""FastAPI adapter for the Python-authored Genro Pages comparison."""
import json
import os
from pathlib import Path

import genro_pages
from fastapi.responses import FileResponse, HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from genro_tytx import to_tytx

from frontends.pages.recipe import HelloWorldPage

DEFAULT_CLIENT_MODULES = Path(
    "/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/"
    "genro-pages/temp/client-releases-20260908"
)


class PagesHost:
    """Mount the Pages shell, recipe and existing client runtime on FastAPI."""

    def __init__(self, root):
        self.root = Path(root).resolve()
        configured = os.environ.get("ROSETTA_CLIENT_MODULES")
        self.client_modules = Path(configured).resolve() if configured else DEFAULT_CLIENT_MODULES
        self.frontend = self.root / "frontends" / "pages"
        self.assets = {
            "dom": self.client_modules / "genro-dom-js" / "src",
            "bag": self.client_modules / "genro-bag-js" / "src",
            "tytx": self.client_modules / "genro-tytx" / "js" / "src",
            "pages": Path(genro_pages.__file__).resolve().parents[2] / "js" / "src",
            "msgpack": (
                self.client_modules / "node_modules" / "@msgpack" / "msgpack" / "dist.esm"
            ),
        }
        for directory in (*self.assets.values(), self.frontend):
            if not directory.is_dir():
                raise ValueError(f"Missing Pages asset directory: {directory}")

    def mount(self, app):
        """Add the Pages routes and narrowly scoped static asset mounts."""
        app.add_api_route("/examples/pages/hello-world/", self.index, include_in_schema=False)
        app.add_api_route("/examples/pages/hello-world/recipe", self.recipe, include_in_schema=False)
        app.add_api_route("/pages/app.js", self.application_script, include_in_schema=False)
        app.add_api_route("/pages/module.js", self.module_script, include_in_schema=False)
        app.add_api_route("/examples/pages-js/hello-world/", self.js_index, include_in_schema=False)
        app.mount("/pages-js", StaticFiles(directory=self.root / "frontends/pages-js"), name="pages-js")
        for name, directory in self.assets.items():
            app.mount(
                f"/pages/assets/{name}", StaticFiles(directory=directory),
                name=f"pages-{name}",
            )

    def index(self):
        imports = {
            "genro-dom-js": "/pages/assets/dom/index.js",
            "genro-bag-js": "/pages/assets/bag/index.js",
            "#uuid": "/pages/assets/bag/browser-uuid.js",
            "genro-tytx": "/pages/assets/tytx/index.js",
            "@xmldom/xmldom": "/pages/assets/pages/xmldom.js",
            "@msgpack/msgpack": "/pages/assets/msgpack/index.mjs",
            "module": "/pages/module.js",
        }
        importmap = json.dumps({"imports": imports}).replace("<", "\\u003c")
        template = (self.frontend / "index.html").read_text()
        return HTMLResponse(template.replace("__ROSETTA_IMPORTMAP__", importmap))

    def js_index(self):
        """Reuse the runtime shell for an independently authored JavaScript recipe."""
        response = self.index()
        return HTMLResponse(response.body.decode().replace('/pages/app.js', '/pages-js/app.js'))

    def recipe(self):
        builder = HelloWorldPage.source_builder("main")
        HelloWorldPage().main(builder.source)
        return Response(
            to_tytx(builder.source, transport="json"),
            media_type="application/vnd.tytx+json",
        )

    def application_script(self):
        return FileResponse(self.frontend / "app.js", media_type="text/javascript")

    def module_script(self):
        return FileResponse(self.frontend / "module.js", media_type="text/javascript")
