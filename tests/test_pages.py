"""The installed Gramlot adapter owns Python discovery, transport and assets."""
import importlib.util
import json
import re

import pytest
from fastapi.testclient import TestClient
from genro_tytx import from_tytx
from gramlot.contrib.fastapi.application import PageCollection

from backend.app import DemoServer


def test_installed_adapter_discovers_active_lessons():
    server = DemoServer()
    assert isinstance(server.pages_host.pages, PageCollection)
    assert set(server.pages_host.pages.page_classes) == {'hello-world', 'data-binding', 'input-widgets', 'contact-box', 'repeated-contacts', 'contact-colors'}
    client = TestClient(server.app)
    response = client.get('/examples/pages/hello-world/recipe')
    assert response.headers['content-type'].startswith('application/vnd.tytx+json')
    source = from_tytx(response.text, transport='json')
    assert len(source) == 1
    assert 'Hello World' in response.text
    assert importlib.util.find_spec('genro_asgi') is None


def test_adapter_import_map_assets_and_entry_are_served():
    client = TestClient(DemoServer().app)
    response = client.get('/examples/pages/hello-world/')
    assert re.search(r'/examples/pages/_runtime/[0-9a-f]+/esm/gramlot-page-startup.js',
                     response.text)
    assert '<h1>' not in response.text
    imports = json.loads(re.search(r'<script type="importmap">(.*?)</script>',
                                  response.text).group(1))['imports']
    for key in ['gramlot-dom', 'gramlot-builder', 'genro-bag-js', 'genro-tytx']:
        asset = client.get(imports[key])
        assert asset.status_code == 200
        assert 'javascript' in asset.headers['content-type']
        assert asset.headers['cache-control'] == 'no-cache, must-revalidate'
    assert '/shared/example.css' in response.text
    assert client.get('/examples/pages/_runtime/missing.js').status_code == 404


@pytest.mark.parametrize('variant', ['pages', 'pages-js', 'react', 'vue', 'nicegui'])
def test_later_lessons_are_inactive(variant):
    client = TestClient(DemoServer().app)
    for url in (f'/{variant}/editable-text/', f'/examples/{variant}/editable-text/',
                f'/sources/{variant}?example=editable-text'):
        assert client.get(url).status_code == 404
