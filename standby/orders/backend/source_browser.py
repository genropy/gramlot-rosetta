"""A shared, read-only browser for explicitly listed demo source files."""
from html import escape
from pathlib import Path
from urllib.parse import urlencode

from fastapi import HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse


class SourceBrowser:
    """Read source from this checkout; never accept arbitrary filesystem paths."""

    FILES = {
        "react": {
            "app": ("Application · JSX", "frontends/react/src/App.jsx"),
            "entry": ("Client entry", "frontends/react/src/main.jsx"),
            "build": ("Vite configuration", "frontends/react/vite.config.js"),
        },
        "vue": {
            "app": ("Application · Vue SFC", "frontends/vue/src/App.vue"),
            "entry": ("Client entry", "frontends/vue/src/main.js"),
            "build": ("Vite configuration", "frontends/vue/vite.config.js"),
        },
        "pages": {
            "app": ("Page recipe · Python", "frontends/pages/recipe.py"),
            "client": ("Client controller · JavaScript", "frontends/pages/app.js"),
            "host": ("FastAPI host adapter", "backend/pages_host.py"),
            "shim": ("Browser module adapter", "frontends/pages/module.js"),
            "shell": ("Startup document", "frontends/pages/index.html"),
        },
    }
    SHARED = {
        "backend": ("Shared FastAPI backend", "backend/app.py"),
        "style": ("Shared application style", "shared/style.css"),
    }
    TITLES = {"react": "React", "vue": "Vue", "pages": "Genro Pages"}

    def __init__(self, root):
        self.root = Path(root).resolve()

    def get_page(self, variant: str, file: str = "app", raw: bool = False):
        """Display one allowlisted file, or return its exact plain-text contents."""
        if variant not in self.FILES:
            raise HTTPException(404, "Unknown implementation.")
        files = {**self.FILES[variant], **self.SHARED}
        if file not in files:
            raise HTTPException(404, "Unknown source file.")
        label, filename = files[file]
        path = (self.root / filename).resolve()
        if not path.is_relative_to(self.root) or not path.is_file():
            raise HTTPException(404, "Source unavailable in this checkout.")
        source = path.read_text()
        headers = {"X-Content-Type-Options": "nosniff", "Cache-Control": "no-store"}
        if raw:
            return PlainTextResponse(source, headers=headers)
        template = (self.root / "backend/templates/sources.html").read_text()
        values = {
            "title": escape(self.TITLES[variant]),
            "variant": escape(variant),
            "filename": escape(filename),
            "label": escape(label),
            "implementations": self.get_implementation_links(variant),
            "files": self.get_file_links(variant, files, file),
            "raw_url": escape(f"/sources/{variant}?{urlencode({'file': file, 'raw': 'true'})}"),
            "source": escape(source),
        }
        # One formatting pass: placeholders in the source itself stay literal.
        return HTMLResponse(template.format_map(values), headers=headers)

    def get_implementation_links(self, selected):
        """Offer the same source view for each framework."""
        return "".join(
            f'<a href="/sources/{name}"'
            + (' aria-current="page"' if name == selected else '')
            + f'>{escape(title)}</a>' for name, title in self.TITLES.items()
        )

    def get_file_links(self, variant, files, selected):
        """Label application and supporting files without hiding integration costs."""
        return "".join(
            f'<li><a href="/sources/{variant}?{urlencode({"file": key})}"'
            + (' aria-current="page"' if key == selected else '')
            + f'>{escape(label)}</a></li>' for key, (label, _) in files.items()
        )
