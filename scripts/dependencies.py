"""Report the exact local sources used by the optional Pages prototype.

Run under the same PYTHONPATH as the server. Paths are informative; source hashes
let another checkout distinguish the recorded experiment from later local edits.
"""
import hashlib
import importlib.metadata
import importlib.util
import json
import subprocess
from pathlib import Path


def source_digest(root, patterns):
    digest = hashlib.sha256()
    files = sorted({path for pattern in patterns for path in root.rglob(pattern)
                    if 'node_modules' not in path.relative_to(root).parts})
    for path in files:
        digest.update(str(path.relative_to(root)).encode() + b'\0' + path.read_bytes())
    return {"path": str(root), "files": len(files), "sha256": digest.hexdigest()}


def git_state(root):
    revision = subprocess.run(['git', '-C', str(root), 'rev-parse', 'HEAD'],
                              capture_output=True, text=True, check=False)
    status = subprocess.run(['git', '-C', str(root), 'status', '--short'],
                            capture_output=True, text=True, check=False)
    return {"revision": revision.stdout.strip(), "dirty": bool(status.stdout.strip())}


def report():
    import gramlot
    from gramlot.contrib.fastapi.runtime import PACKAGE_ASSET_DIRECTORIES, RuntimeAssets
    runtime = RuntimeAssets("/examples/pages")
    import genro_builders
    return {
        "python_packages": {name: importlib.metadata.version(name) for name in
                            ('fastapi', 'nicegui', 'gramlot', 'genro-builders', 'genro-bag', 'genro-tytx', 'genro-toolbox')},
        "genro_asgi_installed": importlib.util.find_spec('genro_asgi') is not None,
        "gramlot": source_digest(Path(gramlot.__file__).resolve().parent, ['*.py']),
        "builders": source_digest(Path(genro_builders.__file__).resolve().parent, ['*.py']),
        "builders_origin": importlib.metadata.distribution('genro-builders').read_text('direct_url.json'),
        "source_override": None,
        "assets": {name: source_digest(directory, ['*.js', '*.mjs', '*.css'])
                   for name, relative in PACKAGE_ASSET_DIRECTORIES.items()
                   for directory in [runtime.package_directory / relative]},
    }


if __name__ == '__main__':
    print(json.dumps(report(), indent=2))
