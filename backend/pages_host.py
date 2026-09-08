"""FastAPI adapter for the Python-authored Genro Pages comparison."""
import importlib.util
import json
import os
from pathlib import Path

import genro_pages
from fastapi import HTTPException
from fastapi.responses import FileResponse, HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from genro_tytx import to_tytx

from backend.examples import EXAMPLES
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
        app.add_api_route("/examples/pages/{example}/", self.index, include_in_schema=False)
        app.add_api_route("/examples/pages/{example}/recipe", self.recipe, include_in_schema=False)
        app.add_api_route("/pages/app.js", self.application_script, include_in_schema=False)
        app.add_api_route("/pages/module.js", self.module_script, include_in_schema=False)
        app.add_api_route("/examples/pages-js/{example}/", self.js_index, include_in_schema=False)
        app.mount("/pages-js", StaticFiles(directory=self.root / "frontends/pages-js"), name="pages-js")
        app.add_api_route("/pages/inspector-recipe", self.inspector_recipe, include_in_schema=False)
        app.mount("/pages-common", StaticFiles(directory=self.root / "frontends/pages-common"), name="pages-common")
        for name, directory in self.assets.items():
            app.mount(
                f"/pages/assets/{name}", StaticFiles(directory=directory),
                name=f"pages-{name}",
            )

    def index(self, example: str = "hello-world"):
        if example not in EXAMPLES:
            raise HTTPException(404, "Unknown example.")
        imports = {
            "/_assets/dom/": "/pages/assets/dom/",
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

    def inspector_recipe(self):
        """Serve the library inspector without involving application recipes."""
        from genro_pages.inspector import build_inspector
        from genro_pages.widget_test_builder import WidgetTestBuilder
        builder = WidgetTestBuilder("inspector")
        build_inspector(builder.source)
        return Response(to_tytx(builder.source, transport="json"),
                        media_type="application/vnd.tytx+json")

    def js_index(self, example: str):
        """Reuse the runtime shell for an independently authored JavaScript recipe."""
        response = self.index(example)
        return HTMLResponse(response.body.decode().replace('/pages/app.js', '/pages-js/app.js'))

    def recipe(self, example: str):
        if example not in EXAMPLES:
            raise HTTPException(404, "Unknown example.")
        page_class = HelloWorldPage
        if example != "hello-world":
            spec = importlib.util.spec_from_file_location("example", self.frontend / "examples" / f"{example}.py")
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            page_class = module.ExamplePage
        builder = page_class.source_builder("main")
        page_class().main(builder.source)
        return Response(
            to_tytx(builder.source, transport="json"),
            media_type="application/vnd.tytx+json",
        )

    def application_script(self):
        return FileResponse(self.frontend / "app.js", media_type="text/javascript")

    def module_script(self):
        return FileResponse(self.frontend / "module.js", media_type="text/javascript")
