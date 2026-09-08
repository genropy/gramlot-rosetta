"""Shared behavioral API contract for every implementation."""
import importlib.util

import pytest
from fastapi.testclient import TestClient

from backend.app import DemoServer


@pytest.fixture
def client():
    return TestClient(DemoServer(pages=False).app)


def test_seed_and_server_total(client):
    orders = client.get("/api/orders").json()
    assert [item["id"] for item in orders] == [1, 2, 3]
    assert orders[0]["total_cents"] == 2500


def test_save_and_reset(client):
    changes = dict(customer="  New name  ", quantity=4, note="Saved", fulfilled=True)
    response = client.put("/api/orders/1", json=changes)
    assert response.status_code == 200
    saved = response.json()
    assert saved["customer"] == "New name"
    assert saved["total_cents"] == 5000
    assert client.get("/api/orders").json()[0] == saved
    assert client.post("/api/reset").json()[0]["customer"] == "Ada Studio"


@pytest.mark.parametrize("field,value", [
    ("customer", "  "), ("quantity", 0), ("quantity", 101), ("quantity", 1.5),
    ("quantity", "2"), ("quantity", True), ("note", "x" * 201), ("fulfilled", "true"),
    ("total_cents", 1),
])
def test_rejected_change_preserves_order(client, field, value):
    before = client.get("/api/orders").json()
    changes = dict(customer="Ada Studio", quantity=2, note="", fulfilled=False)
    changes[field] = value
    response = client.put("/api/orders/1", json=changes)
    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)
    assert client.get("/api/orders").json() == before


def test_unknown_order(client):
    response = client.put("/api/orders/999", json=dict(
        customer="Ada", quantity=1, note="", fulfilled=False))
    assert response.status_code == 404


def test_independent_server_instances():
    first = TestClient(DemoServer(pages=False).app)
    second = TestClient(DemoServer(pages=False).app)
    first.put("/api/orders/1", json=dict(customer="Other", quantity=1, note="", fulfilled=False))
    assert second.get("/api/orders").json()[0]["customer"] == "Ada Studio"


def test_no_genro_asgi_installed():
    assert importlib.util.find_spec("genro_asgi") is None
