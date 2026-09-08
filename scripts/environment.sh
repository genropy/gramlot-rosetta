#!/usr/bin/env bash
set -euo pipefail
ROSETTA_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROSETTA_ROOT"
export ROSETTA_PAGES_SOURCE="${ROSETTA_PAGES_SOURCE:-$ROSETTA_ROOT/.local/dependencies/genro-pages/src}"
export ROSETTA_BUILDERS_SOURCE="${ROSETTA_BUILDERS_SOURCE:-$ROSETTA_ROOT/.local/dependencies/genro-builders/src}"
export ROSETTA_CLIENT_MODULES="${ROSETTA_CLIENT_MODULES:-$ROSETTA_ROOT/.local/dependencies/client}"
export PYTHONPATH="$ROSETTA_ROOT:$ROSETTA_PAGES_SOURCE:$ROSETTA_BUILDERS_SOURCE"
