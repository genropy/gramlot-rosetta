"""Host Rosetta's common HTML frame and the independent Hello World examples."""
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from backend.source_browser import SourceBrowser


class DemoServer:
    """Serve the comparison frame separately from every framework's application."""

    TITLES = {"react": "React", "vue": "Vue", "pages": "Pages Python", "pages-js": "Pages JS"}

    def __init__(self, root=None, pages=True):
        self.root = Path(root) if root else Path(__file__).resolve().parents[1]
        self.app = FastAPI(title="Demo Rosetta", version="0.2.0")
        self.app.add_api_route("/", self.index, include_in_schema=False)
        self.app.add_api_route("/{variant}/", self.get_demo, include_in_schema=False)
        self.source_browser = SourceBrowser(self.root)
        self.app.add_api_route("/sources/{variant}", self.source_browser.get_page,
                               include_in_schema=False)
        self.app.mount("/shared", StaticFiles(directory=self.root / "shared"), name="shared")
        for name in ("react", "vue"):
            build = self.root / "frontends" / name / "dist"
            if build.is_dir():
                self.app.mount(f"/examples/{name}/hello-world",
                               StaticFiles(directory=build, html=True), name=name)
        if pages:
            self.mount_pages()

    def index(self):
        """Start with the Python-authored Hello World example."""
        return RedirectResponse("/pages/")

    def get_demo(self, variant: str):
        """Fill the common HTML document with the chosen framework's URLs."""
        if variant not in self.TITLES:
            raise HTTPException(404, "Unknown implementation.")
        template = (self.root / "backend/templates/frame.html").read_text()
        return HTMLResponse(template.format_map({
            "variant": variant,
            "title": self.TITLES[variant],
            **{f"{name}_current": 'aria-current="page"' if name == variant else ''
               for name in self.TITLES},
        }))

    def mount_pages(self):
        """Connect the optional Pages host without requiring it for React/Vue."""
        from backend.pages_host import PagesHost
        self.pages_host = PagesHost(self.root)
        self.pages_host.mount(self.app)


def create_app():
    """Create one demo server for the command-line ASGI runner."""
    return DemoServer(pages=os.environ.get("ROSETTA_WITH_PAGES", "1") == "1").app
