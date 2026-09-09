"""Host Rosetta's common HTML frame and the independent Hello World examples."""
import os
from html import escape
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from backend.examples import EXAMPLES
from backend.source_browser import SourceBrowser


class DemoServer:
    """Serve the comparison frame separately from every framework's application."""

    TITLES = {"react": "React", "vue": "Vue", "pages": "Gramlot Python", "pages-js": "Gramlot JS"}

    def __init__(self, root=None, pages=True):
        self.root = Path(root) if root else Path(__file__).resolve().parents[1]
        self.app = FastAPI(title="Gramlot Rosetta", version="0.2.0")
        @self.app.middleware("http")
        async def development_cache(request, call_next):
            response = await call_next(request)
            response.headers["Cache-Control"] = "no-cache, must-revalidate"
            return response

        self.app.add_api_route("/", self.index, include_in_schema=False)
        self.app.add_api_route("/{variant}/", self.get_demo, include_in_schema=False)
        self.app.add_api_route("/{variant}/{example}/", self.get_demo, include_in_schema=False)
        self.source_browser = SourceBrowser(self.root)
        self.app.add_api_route("/sources/{variant}", self.source_browser.get_page,
                               include_in_schema=False)
        self.app.mount("/shared", StaticFiles(directory=self.root / "shared"), name="shared")
        for name in ("react", "vue"):
            build = self.root / "frontends" / name / "dist"
            if build.is_dir():
                self.app.mount(f"/examples/{name}/assets", StaticFiles(directory=build / "assets"), name=name)
                self.app.add_api_route(f"/examples/{name}/{{example}}/", self.frontend_document(name), include_in_schema=False)
        if pages:
            self.mount_pages()

    def index(self):
        """Start with the Python-authored Hello World example."""
        return RedirectResponse("/pages/")

    def get_demo(self, variant: str, example: str = "hello-world"):
        """Fill the common HTML document with the chosen framework's URLs."""
        if variant not in self.TITLES or example not in EXAMPLES:
            raise HTTPException(404, "Unknown implementation.")
        template = (self.root / "backend/templates/frame.html").read_text()
        return HTMLResponse(template.format_map({
            "variant": variant,
            "example": example,
            "example_title": EXAMPLES[example],
            "example_links": ''.join(f'<a href="/{variant}/{key}/"' + (' aria-current="page"' if key == example else '') + f'>{index}. {escape(title)}</a>' for index, (key, title) in enumerate(EXAMPLES.items(), 1)),
            "title": self.TITLES[variant],
            **{f"{name}_current": 'aria-current="page"' if name == variant else ''
               for name in self.TITLES},
        }))

    def frontend_document(self, variant):
        """Serve a shared frontend entry for each allowlisted example."""
        def document(example: str):
            if example not in EXAMPLES:
                raise HTTPException(404, "Unknown example.")
            return HTMLResponse((self.root / "frontends" / variant / "dist/index.html").read_text())
        return document

    def mount_pages(self):
        """Connect the optional Pages host without requiring it for React/Vue."""
        from backend.pages_host import PagesHost
        self.pages_host = PagesHost(self.root)
        self.pages_host.mount(self.app)


def create_app():
    """Create one demo server for the command-line ASGI runner."""
    return DemoServer(pages=os.environ.get("ROSETTA_WITH_PAGES", "1") == "1").app
