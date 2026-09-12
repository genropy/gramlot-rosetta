"""Load the generated, content-versioned Gramlot browser distribution."""
import json
from pathlib import Path


class ProductionGramlotAssets:
    """Resolve bundled entries while leaving adapter routes and recipes unchanged."""

    def __init__(self, directory: str | Path):
        self.directory = Path(directory).resolve()
        manifest_path = self.directory / "manifest.json"
        if not manifest_path.is_file():
            raise RuntimeError(
                f"Gramlot production bundle missing at {manifest_path}; run npm run build:gramlot"
            )
        self.manifest = json.loads(manifest_path.read_text())
        self.version = self.manifest["version"]
        self.version_directory = self.directory / self.version
        if not self.version_directory.is_dir():
            raise RuntimeError(f"Gramlot production asset directory missing: {self.version_directory}")
        self.base_url = f"/assets/gramlot/{self.version}/"

    def entry(self, name: str) -> str:
        filename = self.manifest["entries"][name]
        if not (self.version_directory / filename).is_file():
            raise RuntimeError(f"Gramlot production entry missing: {filename}")
        return self.base_url + filename

    def import_map(self) -> dict[str, str]:
        consumer_entries = {"startup", "lab-app", "builder-app", "gramlot-page-startup"}
        return {
            specifier: self.entry(specifier)
            for specifier in self.manifest["entries"]
            if specifier not in consumer_entries
        }

    def configure_runtime(self, runtime) -> None:
        runtime.entry_url = self.entry("startup")
        runtime.import_map = self.import_map
