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
    import gramlot

    from backend.pages_host import PagesHost
    root = Path(__file__).resolve().parents[1]
    host = PagesHost(root)
    import genro_builders
    return {
        "python_packages": {name: importlib.metadata.version(name) for name in
                            ('fastapi', 'genro-builders', 'genro-bag', 'genro-tytx', 'genro-toolbox')},
        "genro_asgi_installed": importlib.util.find_spec('genro_asgi') is not None,
        "gramlot": source_digest(Path(gramlot.__file__).resolve().parent, ['*.py']),
        "builders": source_digest(Path(genro_builders.__file__).resolve().parent, ['*.py']),
        "builders_origin": importlib.metadata.distribution('genro-builders').read_text('direct_url.json'),
        "source_override": os.environ.get('ROSETTA_GRAMLOT_ROOT'),
        "assets": {name: source_digest(directory, ['*.js', '*.mjs', '*.css'])
                   for name, directory in host.assets.items()},
    }


if __name__ == '__main__':
    print(json.dumps(report(), indent=2))
