#!/usr/bin/env bash
set -euo pipefail
ROSETTA_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROSETTA_ROOT"
if [[ ! -x .venv/bin/python ]]; then
  uv venv --python "${ROSETTA_PYTHON:-python3.12}" .venv
fi
uv pip sync --python .venv/bin/python requirements.lock
npm ci --ignore-scripts --no-audit --no-fund
npm run build:editor
for variant in react vue; do
  npm --prefix "frontends/$variant" ci --no-audit --no-fund
  npm --prefix "frontends/$variant" run build
done
if [[ "${ROSETTA_WITH_PAGES:-1}" != "0" ]]; then
  ./scripts/setup-dependencies.sh
fi
printf '%s\n' 'Ready. Run scripts/run.sh.'
