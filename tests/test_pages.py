"""FastAPI hosting contract for real Python Pages without a Genro ASGI server."""
import importlib.util

from fastapi.testclient import TestClient
from genro_tytx import from_tytx

from backend.app import DemoServer


def test_recipe_is_typed_source_and_shell_has_no_rendered_app():
    client = TestClient(DemoServer().app)
    response = client.get('/pages/recipe')
    assert response.status_code == 200
    assert response.headers['content-type'].startswith('application/vnd.tytx+json')
    source = from_tytx(response.text, transport='json')
    assert len(source) > 0
    # UI is transported as source, not HTML accidentally rendered by FastAPI.
    assert '<input' not in response.text
    shell = client.get('/pages/').text
    assert '<input' not in shell
    assert '/pages/app.js' in shell
    assert importlib.util.find_spec('genro_asgi') is None


def test_existing_runtime_assets_available_under_pages_mount():
    client = TestClient(DemoServer().app)
    for path in ('dom/index.js', 'dom/collections/inputs.js', 'bag/index.js',
                 'bag/browser-uuid.js', 'tytx/index.js'):
        response = client.get(f'/pages/assets/{path}')
        assert response.status_code == 200, path
        assert 'javascript' in response.headers['content-type']
    assert client.get('/pages/assets/dom/%2e%2e/%2e%2e/pyproject.toml').status_code == 404
    assert client.get('/pages/assets/dom/missing.js').status_code == 404
