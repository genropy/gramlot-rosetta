"""A shared, read-only browser for explicitly listed demo source files."""
from html import escape
from pathlib import Path
from urllib.parse import urlencode

from fastapi import HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse

from backend.examples import EXAMPLES


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
            "client": ("Page bootstrap · JavaScript", "frontends/pages/app.js"),
            "host": ("FastAPI host adapter", "backend/pages_host.py"),
            "shim": ("Browser module adapter", "frontends/pages/module.js"),
            "shell": ("Startup document", "frontends/pages/index.html"),
        },
    }
    FILES["pages-js"] = {
        "app": ("Page recipe · JavaScript", "frontends/pages-js/recipe.js"),
        "client": ("Page bootstrap · JavaScript", "frontends/pages-js/app.js"),
        "host": ("FastAPI host adapter", "backend/pages_host.py"),
    }
    for name in ("pages", "pages-js"):
        FILES[name]["tools"] = ("Shared Pages inspector tools", "frontends/pages-common/tools.js")
    SHARED = {
        "editor": ("Live editor", "shared/editor/editor.js"),
        "frame": ("Shared HTML frame", "backend/templates/frame.html"),
        "frame-style": ("Frame style", "shared/frame.css"),
        "backend": ("Shared FastAPI backend", "backend/app.py"),
        "style": ("Shared example style", "shared/example.css"),
    }
    TITLES = {"react": "React", "vue": "Vue", "pages": "Pages Python", "pages-js": "Pages JS"}

    def __init__(self, root):
        self.root = Path(root).resolve()

    def get_page(self, variant: str, file: str = "", raw: bool = False, section: str = "page", example: str = "hello-world"):
        """Display one allowlisted file, or return its exact plain-text contents."""
        if variant not in self.FILES:
            raise HTTPException(404, "Unknown implementation.")
        if example not in EXAMPLES:
            raise HTTPException(404, "Unknown example.")
        page_file = self.FILES[variant]["app"]
        if example != "hello-world":
            extension = {"react": "jsx", "vue": "vue", "pages": "py", "pages-js": "js"}[variant]
            directory = f"frontends/{variant}/" + ("src/" if variant in ("react", "vue") else "")
            page_file = (page_file[0], f"{directory}examples/{example}.{extension}")
        groups = {
            "page": {"app": page_file},
            "boilerplate": {key: value for key, value in self.FILES[variant].items()
                            if key != "app"},
            "common": self.SHARED,
        }
        if section not in groups:
            raise HTTPException(404, "Unknown source section.")
        if file:
            section = next((name for name, group in groups.items() if file in group), section)
        files = groups[section]
        file = file or next(iter(files))
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
            "tabs": self.get_section_links(variant, section, example),
            "files": self.get_file_links(variant, files, file, example) if len(files) > 1 else "",
            "raw_url": escape(f"/sources/{variant}?{urlencode({'file': file, 'raw': 'true', 'example': example})}"),
            "source": escape(source),
            "editor_script": '<script type="module" src="/shared/editor/dist/editor.js"></script>'
            if variant == "pages-js" and section == "page" else "",
        }
        # One formatting pass: placeholders in the source itself stay literal.
        return HTMLResponse(template.format_map(values), headers=headers)

    def get_section_links(self, variant, selected, example):
        """Separate page authorship from framework setup and shared context."""
        return "".join(
            f'<a href="/sources/{variant}?section={name}&amp;example={example}"'
            + (' aria-current="page"' if name == selected else '')
            + f'>{label}</a>'
            for name, label in (("page", "Page"), ("boilerplate", "Boilerplate"),
                                ("common", "Common"))
        )

    def get_file_links(self, variant, files, selected, example):
        """Label application and supporting files without hiding integration costs."""
        return "".join(
            f'<li><a href="/sources/{variant}?{urlencode({"file": key, "example": example})}"'
            + (' aria-current="page"' if key == selected else '')
            + f'>{escape(label)}</a></li>' for key, (label, _) in files.items()
        )
