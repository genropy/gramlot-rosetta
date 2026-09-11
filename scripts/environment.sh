#!/usr/bin/env bash
set -euo pipefail
ROSETTA_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROSETTA_ROOT"
export PYTHONPATH="$ROSETTA_ROOT"
