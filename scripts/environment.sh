#!/usr/bin/env bash
set -euo pipefail
ROSETTA_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROSETTA_ROOT"
export PYTHONPATH="$ROSETTA_ROOT"
if [[ -n "${ROSETTA_GRAMLOT_ROOT:-}" ]]; then
  export PYTHONPATH="$ROSETTA_ROOT:$ROSETTA_GRAMLOT_ROOT/src"
fi
