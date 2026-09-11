#!/usr/bin/env bash
# Install the current Gramlot package, including its optional FastAPI adapter.
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"
if [[ -n "${ROSETTA_GRAMLOT_ROOT:-}" ]]; then
  # The framework owner prepares resources before building; do not modify siblings.
  uv pip install --python .venv/bin/python "$ROSETTA_GRAMLOT_ROOT[fastapi]"
else
  wheel="${ROSETTA_GRAMLOT_WHEEL:-$repo_root/.local/packages/gramlot-0.1.0a1-py3-none-any.whl}"
  if [[ ! -f "$wheel" ]]; then
    echo "Set ROSETTA_GRAMLOT_WHEEL to a current Gramlot wheel containing the FastAPI adapter." >&2
    exit 1
  fi
  uv pip install --python .venv/bin/python --force-reinstall "$wheel"
fi
.venv/bin/python -c 'from gramlot.contrib.fastapi import mount_gramlot'
