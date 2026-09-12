# Rosetta deployment

Live at https://rosetta.gramlot.org since 2026-09-11. Pre-alpha; the first usable
release is planned for late 2026. FastAPI/Uvicorn runs behind Hetzner nginx at
127.0.0.1:19181. The separate Compose project is /opt/gramlot-rosetta.

## Build inputs and registry

The approved Gramlot wheel is downloaded from GitHub release v0.1.3 in
 genropy/gramlot, with the source-controlled SHA256
893b9a75a10437f239739b70f635a602dac24864e68b0c1de4deea2cc80dfae2.
The old private artifact checkout and FRAMEWORK_READ_KEY are no longer used.
No PyPI, npm or CDN publication is part of this deployment.

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

.github/workflows/publish.yml verifies PRs and main pushes without publication.
Version tags vMAJOR.MINOR.PATCH (optionally with a prerelease suffix) must identify
an ancestor of origin/main. Only tag runs publish and deploy the tested image.
PUBLISH_ENABLED=true and DEPLOY_ENABLED=true are stop switches; production permits
v* tags only. There is no untagged workflow_dispatch bypass. Deployments use
immutable image digests and Compose health checks. Framework and application tags
are separate release actions.

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

The updated local amd64 image passed all 50 browser tests, including
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
