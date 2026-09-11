# Rosetta deployment

Live at https://rosetta.gramlot.org since 2026-09-11. Pre-alpha; the first usable
release is planned for late 2026. FastAPI/Uvicorn runs behind Hetzner nginx at
127.0.0.1:19181. The separate Compose project is /opt/gramlot-rosetta.

## Build inputs and registry

The approved Gramlot wheel comes from the private genropy/gramlot-site repository:
FRAMEWORK_REF=090bbd37feeb3576c08a7d47502a9f3bb26b4583 and
GRAMLOT_WHEEL_SHA256=90a1558181efb9bb0f2555659263fe8a97696462afa26f3b046bc09b3ef85e7d.
FRAMEWORK_READ_KEY is its owner-authorized read-only deploy key. The public PyPI
pin is unchanged; this deployment does not publish a framework release.

Local builds require the wheel under ignored .build/ and its mandatory SHA256
build argument. Docker verifies the hash, installs existing locks, runs pip check,
builds React/Vue/CodeMirror, retains displayed sources and runs as uid 10001.
No sibling framework source is copied. /health reports the wheel hash/channel.

Images use the PRIVATE package ghcr.io/genropy/gramlot-rosetta-runtime. Its source
association/inherited access remains the private site repo. This Rosetta repo has
Actions Write access on the package. CI checks visibility before reading the wheel
and again before pushing; a missing or non-private package blocks publication.
The package was created first with an empty image so no private artifact was used
before its visibility was verified. The original public package was withdrawn.
Never upload the runtime image as an Actions artifact in this public repository.

## CI and access

.github/workflows/publish.yml verifies PRs and builds/tests/publishes main updates.
Fork PRs do not receive the private artifact secret and cannot pass full container
verification. Main builds and pushes the exact tested image in one job.
PUBLISH_ENABLED=true and DEPLOY_ENABLED=true are configured; production permits
main only. Deployments use immutable image digests and Compose health checks.
A manual workflow_dispatch also works; deploy_once is for initial activation only.

Production secrets are DEPLOY_SSH_KEY and DEPLOY_KNOWN_HOSTS; the destination is
an environment variable. The dedicated SSH key has a forced application-specific
command. A root-owned wrapper validates the image reference, uses the job token
for temporary registry login, and removes those credentials afterward. CI has no
interactive shell and cannot replace the host's root-owned Compose/scripts.
The deployment account is not in the Docker group.

Keep loopback binding, read-only filesystem, tmpfs, capability restrictions and
nginx WebSocket/forwarded-header settings. No persistent example storage or
subscriber service is included. TLS renewal and nginx reload are configured.

## Checks and recovery

The actual amd64 image and public HTTPS site passed all 50 browser tests, including
NiceGUI live updates and WebSockets. deploy/check-container.py verifies health,
six public routes and private-path boundaries. The delayed NiceGUI first-input
reset was fixed by initializing its value before binding; ten focused repeats passed.

Use gh run list to follow releases. Set DEPLOY_ENABLED=false to stop automatic
host updates; set PUBLISH_ENABLED=false to stop image publication as well.
deploy.sh preserves the running release on pull failure and restores its prior
recorded digest on failed startup. The initial release has no rollback predecessor.
current-image and .env record the last successful digest. Retain successful CI run
IDs and image tags. gh run rerun KNOWN_GOOD_RUN_ID --repo genropy/gramlot-rosetta
rebuilds/tests/deploys a known-good source release. Administrative host configuration
changes remain separate from application CI. See the private site's deployment
runbook for the shared nginx, DNS, SSH wrapper and certificate configuration.
