"""Host Rosetta's common HTML frame and the independent Hello World examples."""
import os
import json
from html import escape
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from backend.examples import EXAMPLES, DESCRIPTIONS
from backend.source_browser import SourceBrowser
from backend.lesson_notes import LESSON_NOTES, LESSON_COMPARISONS


class DemoServer:
    """Serve the comparison frame separately from every framework's application."""

    TITLES = {"react": "React", "vue": "Vue", "pages": "Gramlot Python", "pages-js": "Gramlot JS", "nicegui": "NiceGUI"}

    def __init__(self, root=None, pages=True, nicegui=False):
        self.root = Path(root) if root else Path(__file__).resolve().parents[1]
        self.app = FastAPI(title="Gramlot Rosetta", version="0.2.0")
        @self.app.middleware("http")
        async def development_cache(request, call_next):
            response = await call_next(request)
            if request.url.path in {f"/examples/pages/{key}/" for key in EXAMPLES} and response.status_code == 200:
                body = b"".join([chunk async for chunk in response.body_iterator])
                body = body.replace(b"</head>", b'<link rel="stylesheet" href="/shared/example.css"></head>')
                headers = dict(response.headers)
                headers.pop("content-length", None)
                response = HTMLResponse(body, headers=headers)
            response.headers["Cache-Control"] = "no-cache, must-revalidate"
            return response

        self.app.add_api_route('/service-worker.js', self.service_worker, include_in_schema=False)
        self.app.add_api_route("/builder/", self.visual_builder, include_in_schema=False)
        self.app.add_api_route("/", self.index, include_in_schema=False)
        self.app.add_api_route("/overview/", self.overview, include_in_schema=False)
        self.app.add_api_route("/overview/{variant}/", self.overview, include_in_schema=False)
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
        if nicegui:
            from backend.nicegui_host import mount_nicegui
            mount_nicegui(self.app)

    def visual_builder(self):
        if not hasattr(self, 'pages_host'):
            raise HTTPException(503, 'The visual builder requires the Gramlot runtime.')
        template = (self.root / 'shared/builder/index.html').read_text()
        imports = self.pages_host.pages.runtime.import_map()
        return HTMLResponse(template.replace('__IMPORTS__', json.dumps({'imports': imports}).replace('<', r'\u003c')))

    def service_worker(self):
        return FileResponse(self.root / 'shared/pwa/service-worker.js',
                            media_type='text/javascript', headers={'Service-Worker-Allowed': '/'})

    def index(self):
        """Start with the overview of the learning guide."""
        return RedirectResponse("/overview/")

    def get_demo(self, variant: str, example: str = "hello-world"):
        """Fill the common HTML document with the chosen framework's URLs."""
        if variant not in self.TITLES or example not in EXAMPLES:
            raise HTTPException(404, "Unknown implementation.")
        template = (self.root / "backend/templates/lesson.html").read_text()
        content = template.format_map({
            "example_label": "Live example" if variant == "pages-js" else "Example",
            "inspector_tool": ('<div class="example-tools"><button type="button" '
                               'class="inspector-tool" aria-label="Open inspector" '
                               'title="Inspector"><span aria-hidden="true">🔍</span> Open inspector</button></div>')
                              if variant in ('pages', 'pages-js') else '',
            "variant": variant,
            "example": example,
            "example_title": EXAMPLES[example],
            "lesson_number": f"{list(EXAMPLES).index(example) + 1:02d}",
            "description": DESCRIPTIONS[example],
            "lesson_note": escape(LESSON_NOTES[example][variant]),
            "lesson_comparison": (
                '<section class="lesson-note lesson-comparison" aria-label="How it compares">'
                '<h2>How it compares</h2><p>'
                + escape(LESSON_COMPARISONS[example][variant]) + '</p></section>'
            ) if variant in LESSON_COMPARISONS[example] else '',
            "example_links": ''.join(f'<a href="/{variant}/{key}/"' + (' aria-current="page"' if key == example else '') + f'>{index}. {escape(title)}</a>' for index, (key, title) in enumerate(EXAMPLES.items(), 1)),
            "title": self.TITLES[variant],
            **{f"{name}_current": 'aria-current="page"' if name == variant else ''
               for name in self.TITLES},
        })
        return self.master(content, f"{self.TITLES[variant]} · {EXAMPLES[example]}",
                           selected=example, variant=variant)

    def master(self, content, title, *, selected, variant="pages"):
        def link(url, label, key):
            current = ' aria-current="page"' if selected == key else ''
            return f'<li><a href="{url}"{current}>{escape(label)}</a></li>'

        overview_links = link('/overview/', 'Introduction', 'introduction')
        for name in ('pages', 'pages-js', 'react', 'vue', 'nicegui'):
            overview_links += link(f'/overview/{name}/', self.TITLES[name], name)
        overview_links += link('/builder/', 'Visual builder · PoC', 'builder')
        overview_links += link('/overview/styles/', 'Example styles', 'styles')
        overview_links += link('/overview/common/', 'Shared infrastructure', 'common')
        lessons = ''.join(link(f'/{variant}/{key}/', label, key)
                          for key, label in EXAMPLES.items())
        navigation = (
            '<nav aria-label="Groups and lessons">'
            '<details open><summary>Overview</summary><ul>' + overview_links + '</ul></details>'
            '<details open><summary>Simple examples</summary><ul>' + lessons + '</ul></details>'
            '</nav>'
        )
        template = (self.root / 'backend/templates/frame.html').read_text()
        return HTMLResponse(template.format_map({
            'title': escape(title), 'example_title': 'Learning guide',
            'navigation': navigation, 'content': content,
        }))

    def overview(self, variant: str = "introduction"):
        descriptions = {
            'styles': 'Shared example styles are defined here once for all implementations. Field styles cover the compact inputs; Contact styles define the cards, title bars and repeated layout.',
            'pages': 'Python declares a Source tree in Page.main(). Gramlot’s FastAPI adapter '
                     'discovers pages, serializes their recipes and serves the browser runtime.',
            'pages-js': 'JavaScript declares the same kind of Source tree directly in the browser.',
            'react': 'React mounts a component into the document. The shared client entry and Vite '
                     'configuration are reused by the application’s pages.',
            'vue': 'Vue mounts a single-file component into the document. The shared client entry '
                   'and Vite configuration are reused by the application’s pages.',
            'nicegui': 'NiceGUI registers Python page functions on FastAPI and manages its own '
                       'browser connection. This host integration is shared by its pages.',
            'common': 'The master page, navigation, source viewer, editor and comparison styles '
                      'serve every implementation. They are separate from each lesson’s authored code.',
        }
        if variant == 'introduction':
            content = (self.root / 'backend/templates/overview.html').read_text()
            return self.master(content, 'Overview', selected=variant)
        if variant not in descriptions:
            raise HTTPException(404, 'Unknown overview page.')
        title = 'Example styles' if variant == 'styles' else self.TITLES.get(variant, 'Shared infrastructure')
        source_variant = 'pages' if variant in ('common', 'styles') else variant
        section = variant if variant in ('common', 'styles') else 'boilerplate'
        notice = (
            '<aside class="important-info" aria-label="Important information">'
            '<strong>ⓘ Try your own version</strong>'
            '<p>Gramlot JS examples are editable. Change the code and press <b>Run</b> '
            'to see your version. Use <b>Reset</b> to restore the original example. '
            'Changes stay in your browser and are not saved to files.</p></aside>'
        ) if variant == 'pages-js' else ''
        content = (
            '<section class="lesson-intro"><p class="eyebrow">Overview · Shared setup</p>'
            f'<h1>{escape(title)}</h1><p>{escape(descriptions[variant])}</p></section>'
            f'{notice}'
            '<section class="overview-source" aria-label="Shared source">'
            f'<iframe title="Setup · {escape(title)}" '
            f'src="/sources/{source_variant}?section={section}"></iframe></section>'
        )
        return self.master(content, title, selected=variant, variant=source_variant)

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
    return DemoServer(pages=os.environ.get("ROSETTA_WITH_PAGES", "1") == "1", nicegui=True).app
