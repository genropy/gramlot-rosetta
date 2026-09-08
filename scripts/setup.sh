#!/usr/bin/env bash
set -euo pipefail
ROSETTA_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROSETTA_ROOT"
if [[ ! -x .venv/bin/python ]]; then
  uv venv --python "${ROSETTA_PYTHON:-python3.12}" .venv
fi
uv pip sync requirements.lock
npm ci --ignore-scripts --no-audit --no-fund
for variant in react vue; do
  npm --prefix "frontends/$variant" ci --no-audit --no-fund
  npm --prefix "frontends/$variant" run build
done
printf '%s\n' 'Ready. Run scripts/run.sh (Pages requires the documented source dependencies).'
