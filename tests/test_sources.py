"""Source inspection exposes actual demo text without rendering it as markup."""
from html import escape
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from backend.app import DemoServer


@pytest.mark.parametrize('variant,filename', [
    ('react', 'frontends/react/src/App.jsx'),
    ('vue', 'frontends/vue/src/App.vue'),
    ('pages', 'frontends/pages/recipe.py'),
])
def test_source_matches_checkout_and_raw_text(variant, filename):
    server = DemoServer(pages=False)
    client = TestClient(server.app)
    expected = (server.root / filename).read_text()
    response = client.get(f'/sources/{variant}')
    assert response.status_code == 200
    assert f'<code>{escape(expected)}</code>' in response.text
    raw = client.get(f'/sources/{variant}?raw=true')
    assert raw.text == expected
    assert raw.headers['content-type'].startswith('text/plain')
    assert raw.headers['x-content-type-options'] == 'nosniff'


@pytest.mark.parametrize('url', [
    '/sources/unknown', '/sources/pages?file=../../AGENTS.md',
    '/sources/react?file=/etc/passwd', '/sources/vue?file=host',
])
def test_source_requests_are_restricted_to_catalog(url):
    assert TestClient(DemoServer(pages=False).app).get(url).status_code == 404


def test_source_text_cannot_inject_html_or_template_placeholders(tmp_path):
    from fastapi import FastAPI

    from backend.source_browser import SourceBrowser
    source = '</code></pre><script>window.injected=true</script>{source}'
    path = tmp_path / 'frontends/pages/recipe.py'
    path.parent.mkdir(parents=True)
    path.write_text(source)
    template = tmp_path / 'backend/templates/sources.html'
    template.parent.mkdir(parents=True)
    root = Path(__file__).resolve().parents[1]
    template.write_text((root / 'backend/templates/sources.html').read_text())
    app = FastAPI()
    app.add_api_route('/sources/{variant}', SourceBrowser(tmp_path).get_page)
    response = TestClient(app).get('/sources/pages')
    assert f'<code>{escape(source)}</code>' in response.text
    assert '<script>' not in response.text
