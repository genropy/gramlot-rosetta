#!/usr/bin/env bash
# Gramlot is not published yet: consume a reviewed local wheel, or explicit source.
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"
uv pip install --python .venv/bin/python 'genro-builders==0.23.2'
if [[ -n "${ROSETTA_GRAMLOT_ROOT:-}" ]]; then
  test -f "$ROSETTA_GRAMLOT_ROOT/src/gramlot/builder.py"
  npm ci --prefix "$ROSETTA_GRAMLOT_ROOT/js/dom" --ignore-scripts --no-audit --no-fund
else
  wheel="${ROSETTA_GRAMLOT_WHEEL:-$repo_root/.local/packages/gramlot-0.1.0a1-py3-none-any.whl}"
  if [[ ! -f "$wheel" ]]; then
    echo "Set ROSETTA_GRAMLOT_WHEEL to the new Gramlot wheel; it is not published yet." >&2
    exit 1
  fi
  uv pip install --python .venv/bin/python --force-reinstall "$wheel"
fi
