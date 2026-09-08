#!/usr/bin/env bash
set -euo pipefail
ROSETTA_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROSETTA_ROOT"
export ROSETTA_PAGES_SOURCE="${ROSETTA_PAGES_SOURCE:-/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-pages/src}"
export ROSETTA_BUILDERS_SOURCE="${ROSETTA_BUILDERS_SOURCE:-/Users/gporcari/Documents/ChatGPT/genro-pages/worktrees/genro-builders/src}"
export ROSETTA_CLIENT_MODULES="${ROSETTA_CLIENT_MODULES:-/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-pages/temp/client-releases-20260908}"
export PYTHONPATH="$ROSETTA_ROOT:$ROSETTA_PAGES_SOURCE:$ROSETTA_BUILDERS_SOURCE"
