#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/environment.sh"
.venv/bin/python -m pytest -q
.venv/bin/ruff check backend tests scripts frontends/pages
# Start scripts/run.sh in a separate terminal before browser checks.
PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/tmp/demo-rosetta-browsers}" npm test
