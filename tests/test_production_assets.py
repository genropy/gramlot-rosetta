import json

import pytest
from fastapi.testclient import TestClient

from backend.app import DemoServer
from backend.production_assets import ProductionGramlotAssets

ENTRY_NAMES = (
    "startup", "lab-app", "builder-app", "gramlot-page-startup", "gramlot-dom",
    "gramlot-builder", "genro-bag-js", "genro-tytx", "decimal.js",
    "@msgpack/msgpack", "@xmldom/xmldom", "module",
)


def production_fixture(tmp_path):
    version = "0123456789abcdef"
    directory = tmp_path / "gramlot"
    version_directory = directory / version
    version_directory.mkdir(parents=True)
    entries = {name: f"{name}.js" for name in ENTRY_NAMES}
    for filename in entries.values():
        path = version_directory / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("export {};\n")
    (directory / "manifest.json").write_text(json.dumps({"version": version, "entries": entries}))
    return directory, version


def test_production_pages_use_versioned_bundle_and_cache_only_assets(tmp_path, monkeypatch):
    directory, version = production_fixture(tmp_path)
    monkeypatch.setenv("GRAMLOT_ROSETTA_ASSETS", str(directory))
    client = TestClient(DemoServer(production=True).app)

    page = client.get("/examples/pages/hello-world/")
    assert f'/assets/gramlot/{version}/startup.js' in page.text
    assert page.headers["cache-control"] == "no-cache, must-revalidate"
    js_page = client.get("/examples/pages-js/hello-world/")
    assert f'/assets/gramlot/{version}/lab-app.js' in js_page.text
    assert f'/assets/gramlot/{version}/gramlot-dom.js' in js_page.text
    builder = client.get("/builder/")
    assert f'/assets/gramlot/{version}/builder-app.js' in builder.text

    asset = client.get(f"/assets/gramlot/{version}/startup.js")
    assert asset.status_code == 200
    assert asset.headers["cache-control"] == "public, max-age=31536000, immutable"
    missing = client.get(f"/assets/gramlot/{version}/missing.js")
    assert missing.status_code == 404
    assert missing.headers["cache-control"] == "no-cache, must-revalidate"
    assert client.get("/assets/gramlot/other/startup.js").status_code == 404
    assert client.get("/assets/gramlot/manifest.json").status_code == 404


def test_production_fails_clearly_without_bundle(tmp_path, monkeypatch):
    monkeypatch.setenv("GRAMLOT_ROSETTA_ASSETS", str(tmp_path / "missing"))
    with pytest.raises(RuntimeError, match="run npm run build:gramlot"):
        DemoServer(production=True)


def test_development_still_uses_adapter_modules():
    response = TestClient(DemoServer(production=False).app).get(
        "/examples/pages/hello-world/"
    )
    assert "/examples/pages/_runtime/" in response.text
    assert "/esm/gramlot-page-startup.js" in response.text
    assert "/assets/gramlot/" not in response.text


def test_production_without_pages_does_not_require_gramlot_bundle(tmp_path, monkeypatch):
    monkeypatch.setenv("GRAMLOT_ROSETTA_ASSETS", str(tmp_path / "missing"))
    assert TestClient(DemoServer(production=True, pages=False).app).get("/overview/").status_code == 200


def test_manifest_entries_must_exist(tmp_path):
    directory, _ = production_fixture(tmp_path)
    assets = ProductionGramlotAssets(directory)
    (assets.version_directory / "startup.js").unlink()
    with pytest.raises(RuntimeError, match="production entry missing"):
        assets.entry("startup")
