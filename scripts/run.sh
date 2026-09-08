#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/environment.sh"
exec .venv/bin/python -m uvicorn backend.app:create_app --factory --host 127.0.0.1 --port "${ROSETTA_PORT:-8026}"
