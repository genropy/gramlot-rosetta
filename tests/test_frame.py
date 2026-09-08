"""The comparison shell is shared HTML; framework applications stay isolated."""
import pytest
from fastapi.testclient import TestClient

from backend.app import DemoServer


@pytest.mark.parametrize('variant', ['react', 'vue', 'pages', 'pages-js'])
def test_shared_frame_routes_to_one_example(variant):
    client = TestClient(DemoServer(pages=False).app)
    response = client.get(f'/{variant}/')
    assert response.status_code == 200
    assert '<script' not in response.text
    assert f'src="/examples/{variant}/hello-world/"' in response.text
    assert f'href="/sources/{variant}"' in response.text
    assert 'Orders is on standby.' in response.text
    assert '<input' not in response.text


def test_order_api_is_not_part_of_the_active_demo():
    client = TestClient(DemoServer(pages=False).app)
    assert client.get('/api/orders').status_code == 404
    assert client.get('/unknown/').status_code == 404
