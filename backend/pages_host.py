"""FastAPI adapter for the Python-authored Genro Pages comparison."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path

import gramlot
from fastapi import HTTPException
from fastapi.responses import FileResponse, HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from gramlot.transport import to_tytx

from backend.examples import EXAMPLES
from frontends.pages.recipe import HelloWorldPage


class PagesHost:
    """Mount the Pages shell, recipe and existing client runtime on FastAPI."""

    def __init__(self, root):
        self.root = Path(root).resolve()
        configured = os.environ.get("ROSETTA_GRAMLOT_ROOT")
        package = Path(gramlot.__file__).resolve().parent
        self.frontend = self.root / "frontends" / "pages"
        if configured:
            source = Path(configured).resolve()
            if package != source / "src/gramlot":
                raise ValueError("Gramlot Python and browser sources must use ROSETTA_GRAMLOT_ROOT")
            modules = source / "js/dom/node_modules"
            self.assets = {
                "dom": source / "js/dom/src",
                "bag": modules / "genro-bag-js/src",
                "tytx": modules / "genro-tytx/js/src",
                "pages": source / "js/pages/src",
                "msgpack": modules / "@msgpack/msgpack/dist.esm",
            }
        else:
            resources = package / "resources"
            self.assets = {
                "dom": resources / "gramlot-dom/src",
                "bag": resources / "genro-bag-js/src",
                "tytx": resources / "genro-tytx/js/src",
                "pages": resources / "pages",
                "msgpack": resources / "genro-tytx/js/node_modules/@msgpack/msgpack/dist.esm",
            }
        self.assets.update({
            "python": self.frontend,
            "javascript": self.root / "frontends/pages-js",
            "tools": self.root / "frontends/pages-common",
        })
        for directory in (*self.assets.values(), self.frontend):
            if not directory.is_dir():
                raise ValueError(f"Missing Pages asset directory: {directory}")

        digest = hashlib.sha256()
        for name, directory in sorted(self.assets.items()):
            for path in sorted(directory.rglob("*")):
                if path.is_file() and path.suffix in {".js", ".mjs", ".css", ".html"}:
                    digest.update(f"{name}/{path.relative_to(directory)}".encode())
                    digest.update(path.read_bytes())
        self.runtime_prefix = f"/pages/runtime/{digest.hexdigest()[:16]}"

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
            app.mount(f"{self.runtime_prefix}/{name}", StaticFiles(directory=directory),
                      name=f"runtime-{name}")
            app.mount(
                f"/pages/assets/{name}", StaticFiles(directory=directory),
                name=f"pages-{name}",
            )

    def index(self, example: str = "hello-world"):
        if example not in EXAMPLES:
            raise HTTPException(404, "Unknown example.")
        imports = {
            "/_assets/dom/": "/pages/assets/dom/",
            "gramlot-dom": "/pages/assets/dom/index.js",
            "genro-bag-js": "/pages/assets/bag/index.js",
            "#uuid": "/pages/assets/bag/browser-uuid.js",
            "genro-tytx": "/pages/assets/tytx/index.js",
            "@xmldom/xmldom": "/pages/assets/pages/xmldom.js",
            "@msgpack/msgpack": "/pages/assets/msgpack/index.mjs",
            "module": "/pages/module.js",
        }
        imports = {key: value.replace("/pages/assets/", self.runtime_prefix + "/")
                   for key, value in imports.items()}
        imports.update({
            "/pages/assets/": self.runtime_prefix + "/",
            "/pages-common/": self.runtime_prefix + "/tools/",
            "module": self.runtime_prefix + "/python/module.js",
        })
        importmap = json.dumps({"imports": imports}).replace("<", "\\u003c")
        template = (self.frontend / "index.html").read_text()
        document = template.replace("__ROSETTA_IMPORTMAP__", importmap)
        return HTMLResponse(document.replace('/pages/app.js', self.runtime_prefix + '/python/app.js'))

    def inspector_recipe(self):
        """Serve the library inspector without involving application recipes."""
        from gramlot.builder import GramlotBuilder
        from gramlot.inspector import build_inspector
        builder = GramlotBuilder("inspector")
        build_inspector(builder.root)
        return Response(to_tytx(builder.source, transport="json"),
                        media_type="application/vnd.tytx+json")

    def js_index(self, example: str):
        """Reuse the runtime shell for an independently authored JavaScript recipe."""
        response = self.index(example)
        return HTMLResponse(response.body.decode().replace(self.runtime_prefix + '/python/app.js', self.runtime_prefix + '/javascript/app.js'))

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
        page_class().main(builder.root)
        return Response(
            to_tytx(builder.source, transport="json"),
            media_type="application/vnd.tytx+json",
        )

    def application_script(self):
        return FileResponse(self.frontend / "app.js", media_type="text/javascript")

    def module_script(self):
        return FileResponse(self.frontend / "module.js", media_type="text/javascript")
