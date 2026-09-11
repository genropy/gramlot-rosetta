#!/usr/bin/env bash
# Called on the host; immutable image only, one Compose project only.
set -euo pipefail
cd "$(dirname "$0")"
image="${1:?Pass image@sha256:digest}"
[[ "$image" =~ ^ghcr.io/genropy/gramlot-rosetta-runtime@sha256:[0-9a-f]{64}$ ]] || { echo 'Unexpected image reference' >&2; exit 2; }
exec 9>.deploy.lock
flock -n 9 || { echo 'Another deployment is running' >&2; exit 3; }
previous="$(cat current-image 2>/dev/null || true)"
export APP_IMAGE="$image"
docker compose --env-file .env -f compose.yaml pull rosetta
if ! docker compose --env-file .env -f compose.yaml up -d --no-build --wait --wait-timeout 120 rosetta; then
  if [[ "$previous" =~ ^ghcr.io/genropy/gramlot-rosetta-runtime@sha256:[0-9a-f]{64}$ ]]; then
    export APP_IMAGE="$previous"
    docker compose --env-file .env -f compose.yaml up -d --no-build --wait --wait-timeout 120 rosetta
    echo 'Previous image restored' >&2
  fi
  exit 1
fi
printf '%s\n' "$image" > current-image.tmp
mv current-image.tmp current-image
python3 - "$image" <<'PY'
import os, pathlib, sys
p = pathlib.Path('.env')
lines = [line for line in p.read_text().splitlines() if not line.startswith('APP_IMAGE=')]
tmp = p.with_name('.env.next')
tmp.write_text('\n'.join(lines + ['APP_IMAGE=' + sys.argv[1]]) + '\n')
os.chmod(tmp, 0o600)
tmp.replace(p)
PY
