"""FastAPI hosting contract for real Python Pages without a Genro ASGI server."""
import importlib.util

from fastapi.testclient import TestClient
from genro_tytx import from_tytx

from backend.app import DemoServer


def test_recipe_is_typed_source_and_shell_has_no_rendered_app():
    client = TestClient(DemoServer().app)
    response = client.get('/examples/pages/hello-world/recipe')
    assert response.status_code == 200
    assert response.headers['content-type'].startswith('application/vnd.tytx+json')
    source = from_tytx(response.text, transport='json')
    assert len(source) > 0
    # UI is transported as source, not HTML accidentally rendered by FastAPI.
    assert '<input' not in response.text
    shell = client.get('/examples/pages/hello-world/').text
    assert '<input' not in shell
    assert '/pages/runtime/' in shell
    assert '/python/app.js' in shell
    assert importlib.util.find_spec('genro_asgi') is None


def test_existing_runtime_assets_available_under_pages_mount():
    client = TestClient(DemoServer().app)
    for path in ('dom/index.js', 'dom/collections/inputs.js', 'dom/collections/forms.js',
                 'dom/forms/controller.js', 'tools/builder.js', 'bag/index.js',
                 'bag/browser-uuid.js', 'tytx/index.js'):
        response = client.get(f'/pages/assets/{path}')
        assert response.status_code == 200, path
        assert 'javascript' in response.headers['content-type']
    assert client.get('/pages/assets/dom/%2e%2e/%2e%2e/pyproject.toml').status_code == 404
    assert client.get('/pages/assets/dom/missing.js').status_code == 404


def test_runtime_prefix_covers_transitive_modules_and_revalidates():
    import json
    import re
    client = TestClient(DemoServer().app)
    response = client.get('/examples/pages/hello-world/')
    imports = json.loads(re.search(r'<script type="importmap">(.*?)</script>', response.text).group(1))['imports']
    assert imports['genro-dom-js'].startswith('/pages/runtime/')
    assert imports['/_assets/dom/'] == imports['genro-dom-js'].removesuffix('index.js')
    assert imports['/pages/assets/'] in imports['genro-dom-js']
    color_url = imports['/_assets/dom/'] + 'collections/colorpicker.js'
    assert 'WidgetLabel' in client.get(color_url).text
    assert client.get(color_url).headers['cache-control'] == 'no-cache, must-revalidate'
    assert client.get(imports['/pages/assets/'] + 'dom/%2e%2e/%2e%2e/AGENTS.md').status_code == 404
