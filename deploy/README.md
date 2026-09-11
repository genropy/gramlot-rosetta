# Container and deployment

Deployment preparation started on 2026-09-11.
Target: `rosetta.gramlot.org`, FastAPI/Uvicorn behind host nginx on Hetzner.

## Build and verify

Supply an approved `gramlot-0.1.0a1-py3-none-any.whl` under `.build/` (Git-ignored).
Build with `docker build --build-arg GRAMLOT_WHEEL_SHA256=THE_SHA256 -t gramlot-rosetta:verify .`.
The hash is mandatory. The image installs the existing locks, verifies the wheel,
runs `pip check`, builds React/Vue and CodeMirror, retains displayed sources, and
runs as uid 10001. No sibling framework sources are copied.

Start with port 8000 bound to loopback and the read-only/tmpfs/capability settings
in `compose.yaml`. Run `python deploy/check-container.py http://127.0.0.1:PORT`
and `ROSETTA_URL=http://127.0.0.1:PORT npm test`. The actual local container passed
all 50 browser tests, including NiceGUI connection and the editable Gramlot JS
laboratory. `/health` exposes the unpublished wheel channel and exact SHA256.
The approved frozen wheel also builds successfully for linux/amd64 locally;
CI repeats the checks on a native amd64 runner. The current deployment does not persist example data.

## CI and activation

`.github/workflows/publish.yml` verifies PRs, then publishes the tested image on
main. Docker is built once and pushed by the same job after all checks pass.
Do not upload the image as an Actions artifact: this repository is public, while
the approved framework wheel and its containing image must remain private.
Only successful images may deploy; updates use immutable GHCR digests.

Required repository variables:
- `FRAMEWORK_REF`: full commit SHA in private `genropy/gramlot-site`.
- `FRAMEWORK_READ_KEY` secret: owner-approved read-only deploy key for that repo.
  CI checks out only `.packages/gramlot` and does not persist the key.
- `GRAMLOT_WHEEL_SHA256`: its SHA256.
- `DEPLOY_ENABLED`: leave unset until host configuration is verified; `true` enables deployment.

The `production` environment needs `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS` secrets
and `DEPLOY_SSH_DESTINATION` variable (`account@host`). Restrict it to main.
Create `/opt/gramlot-rosetta` on the host, supply `.env` from `.env.example`, and
install the root-owned restricted dispatch/deploy wrappers from gramlot-site.
Each key is forced to its application and cannot open a shell. The wrapper uses
the job GITHUB_TOKEN for registry login in a temporary directory, removed on exit;
no long-lived registry token is stored on the host. CI cannot upload or replace
Compose files or host scripts. Never commit secrets or a live `.env`.

`deploy.sh` validates the digest, locks this application, pulls and starts it with
Compose `--wait`. An unsuccessful update restores the previous recorded digest.
A first deployment has no prior image for rollback.

The proposed binding is `127.0.0.1:19181:8000`; verify the port and host capacity.
Uvicorn trusts forwarded headers only because this service is bound to host
loopback. Do not expose port 8000 directly. nginx must supply forwarded headers
and WebSocket Upgrade/Connection; use the host configuration collected in the
independent gramlot-site repository. Configure DNS, TLS and renewal before
turning on automatic deployment. No database or subscriber service is included.

The source repository is public. The owner approved a frozen wheel kept in the
private site repository, with a pinned commit and SHA256. No PyPI release is
published. Fork PRs cannot access the private artifact secret and cannot pass the
full image verification; run trusted changes from an authorized branch.

Host installation is pending explicit owner approval after automatic review
blocked creation of the deployment account, SSH authorized keys and sudo rule.
