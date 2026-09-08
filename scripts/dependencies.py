"""Report the exact local sources used by the optional Pages prototype.

Run under the same PYTHONPATH as the server. Paths are informative; source hashes
let another checkout distinguish the recorded experiment from later local edits.
"""
import hashlib
import importlib.metadata
import importlib.util
import json
import os
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
    pages = Path(os.environ['ROSETTA_PAGES_SOURCE']).resolve()
    builders = Path(os.environ['ROSETTA_BUILDERS_SOURCE']).resolve()
    modules = Path(os.environ['ROSETTA_CLIENT_MODULES']).resolve()
    return {
        "python_packages": {name: importlib.metadata.version(name) for name in
                            ('fastapi', 'genro-bag', 'genro-tytx', 'genro-toolbox')},
        "genro_asgi_installed": importlib.util.find_spec('genro_asgi') is not None,
        "pages": {**source_digest(pages, ['*.py']), **git_state(pages)},
        "builders": {**source_digest(builders, ['*.py']), **git_state(builders)},
        "dom": source_digest(modules / 'genro-dom-js' / 'src', ['*.js']),
        "bag_js": source_digest((modules / 'genro-bag-js' / 'src').resolve(), ['*.js']),
        "tytx_js": source_digest((modules / 'genro-tytx' / 'js' / 'src').resolve(), ['*.js']),
    }


if __name__ == '__main__':
    print(json.dumps(report(), indent=2))
