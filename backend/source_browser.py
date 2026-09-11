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
            "app": ("Page recipe · Python", "frontends/pages/pages/hello-world.py"),
            "host": ("Gramlot FastAPI integration", "backend/pages_host.py"),
        },
        "pages-js": {
            "app": ("Page recipe · JavaScript", "frontends/pages-js/recipe.js"),
            "client": ("JavaScript laboratory", "frontends/pages-js/app.js"),
            "shell": ("Startup document", "frontends/pages-js/index.html"),
            "host": ("Gramlot FastAPI integration", "backend/pages_host.py"),
        },
        "nicegui": {
            "app": ("Page · Python", "frontends/nicegui/page.py"),
            "host": ("NiceGUI FastAPI integration", "backend/nicegui_host.py"),
        },
    }
    SHARED = {
        "editor": ("Live editor", "shared/editor/editor.js"),
        "frame": ("Shared HTML frame", "backend/templates/frame.html"),
        "lesson": ("Lesson presentation", "backend/templates/lesson.html"),
        "introduction": ("Guide introduction", "backend/templates/overview.html"),
        "source-viewer": ("Source browser", "backend/source_browser.py"),
        "frame-controls": ("Pane resizing and inspector control", "shared/frame.js"),
        "frame-style": ("Frame style", "shared/frame.css"),
        "backend": ("Shared FastAPI backend", "backend/app.py"),
    }
    TITLES = {"react": "React", "vue": "Vue", "pages": "Gramlot Python", "pages-js": "Gramlot JS", "nicegui": "NiceGUI"}

    def __init__(self, root):
        self.root = Path(root).resolve()

    def get_page(self, variant: str, file: str = "", raw: bool = False, section: str = "page", example: str = "hello-world"):
        """Display one allowlisted file, or return its exact plain-text contents."""
        if variant not in self.FILES:
            raise HTTPException(404, "Unknown implementation.")
        if example not in EXAMPLES:
            raise HTTPException(404, "Unknown example.")
        page_file = self.FILES[variant]["app"]
        if example == 'data-binding':
            filename = {
                'pages': 'frontends/pages/pages/data-binding.py',
                'pages-js': 'frontends/pages-js/data-binding.js',
                'react': 'frontends/react/src/DataBinding.jsx',
                'vue': 'frontends/vue/src/DataBinding.vue',
                'nicegui': 'frontends/nicegui/data_binding.py',
            }[variant]
            page_file = (page_file[0], filename)
        if example == 'input-widgets':
            filename = {
                'pages': 'frontends/pages/pages/input-widgets.py',
                'pages-js': 'frontends/pages-js/input-widgets.js',
                'react': 'frontends/react/src/InputWidgets.jsx',
                'vue': 'frontends/vue/src/InputWidgets.vue',
                'nicegui': 'frontends/nicegui/input_widgets.py',
            }[variant]
            page_file = (page_file[0], filename)
        if example == 'contact-box':
            filename = {
                'pages': 'frontends/pages/pages/contact-box.py',
                'pages-js': 'frontends/pages-js/contact-box.js',
                'react': 'frontends/react/src/ContactBox.jsx',
                'vue': 'frontends/vue/src/ContactBox.vue',
                'nicegui': 'frontends/nicegui/contact_box.py',
            }[variant]
            page_file = (page_file[0], filename)
        if example == 'repeated-contacts':
            filename = {
                'pages': 'frontends/pages/pages/repeated-contacts.py',
                'pages-js': 'frontends/pages-js/repeated-contacts.js',
                'react': 'frontends/react/src/RepeatedContacts.jsx',
                'vue': 'frontends/vue/src/RepeatedContacts.vue',
                'nicegui': 'frontends/nicegui/repeated_contacts.py',
            }[variant]
            page_file = (page_file[0], filename)
        if example == 'contact-colors':
            filename = {
                'pages': 'frontends/pages/pages/contact-colors.py',
                'pages-js': 'frontends/pages-js/contact-colors.js',
                'react': 'frontends/react/src/ContactColors.jsx',
                'vue': 'frontends/vue/src/ContactColors.vue',
                'nicegui': 'frontends/nicegui/contact_colors.py',
            }[variant]
            page_file = (page_file[0], filename)
        groups = {
            "page": {"app": page_file},
            "boilerplate": {key: value for key, value in self.FILES[variant].items()
                            if key != "app"},
            "common": self.SHARED,
            "styles": {
                "field-style": ("Shared field styles · CSS", "shared/example.css"),
                "contact-style": ("Contact styles · CSS", "shared/contacts.css"),
            },
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
            "title": "Example styles" if section == "styles" else escape(self.TITLES[variant]),
            "variant": escape(variant),
            "filename": escape(filename),
            "label": escape(label),
            "files": self.get_file_links(variant, files, file, example) if len(files) > 1 else "",
            "raw_url": escape(f"/sources/{variant}?{urlencode({'file': file, 'raw': 'true', 'example': example})}"),
            "source": escape(source),
            "editable": "true" if variant == "pages-js" and section == "page" and file == "app" else "false",
            "language": {".py": "python", ".jsx": "jsx", ".vue": "vue", ".js": "javascript",
                         ".html": "html", ".css": "css"}.get(path.suffix, "text"),
            "editor_script": '<script type="module" src="/shared/editor/dist/editor.js"></script>',
        }
        # One formatting pass: placeholders in the source itself stay literal.
        return HTMLResponse(template.format_map(values), headers=headers)

    def get_file_links(self, variant, files, selected, example):
        """Label application and supporting files without hiding integration costs."""
        return "".join(
            f'<li><a href="/sources/{variant}?{urlencode({"file": key, "example": example})}"'
            + (' aria-current="page"' if key == selected else '')
            + f'>{escape(label)}</a></li>' for key, (label, _) in files.items()
        )
