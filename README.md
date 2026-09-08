# Demo Rosetta

A local, evolving comparison of the same minimal order editor in **React, Vue and
Genro Pages**, hosted by one FastAPI backend. This is a demonstration repository,
not a Genro module. There is no Git remote and nothing is published.

The shared [v1 specification](SPEC.md) deliberately uses a list and a small form.
There is no grid or substitute implementation of a missing Genro component.

## Start the local demo

Prerequisites: Python 3.12, uv, Node compatible with Vite 8 (tested with Node
23.11.0), and npm. Install/build once from this repository:

```sh
./scripts/setup.sh
./scripts/run.sh
```

Open [React](http://127.0.0.1:8026/react/),
[Vue](http://127.0.0.1:8026/vue/), or
[Genro Pages](http://127.0.0.1:8026/pages/). Each page links to the others. **View source** opens a separate tab with the
actual application and supporting files, preserving your unsaved draft.
Set `ROSETTA_PORT` to change the port. The server binds to loopback.

Try changing Quantity and leaving the field, editing Customer, saving, then
switching implementation or reloading. A blank Customer or quantity zero shows a
server validation error. Selecting another order discards unsaved edits. Reset demo
restores the same three fixtures for everyone. State lives in one server process
and resets when it restarts; it is not a multiworker or persistent-storage example.

## Current Pages dependency boundary

The dedicated Python environment contains FastAPI, Bag, TYTX and Toolbox, with
**no genro-asgi installed**. The demo imports the real `WebPage` and
`WidgetTestBuilder` from local Pages/Builders sources and uses the existing DOM
runtime. This demonstrates a working integration boundary, not a released
framework-agnostic Pages installation: the published Pages dependency declaration
still requires genro-asgi, and Builders/DOM still need experimental source state.
No Genro runtime code is copied or patched into this repository.

The default paths in `scripts/environment.sh` match the owner's verified checkouts.
On another machine, set these variables to equivalent source versions before
starting or testing:

| Variable | Directory |
| --- | --- |
| `ROSETTA_PAGES_SOURCE` | Canonical genro-pages `src` |
| `ROSETTA_BUILDERS_SOURCE` | Verified experimental genro-builders `src` |
| `ROSETTA_CLIENT_MODULES` | Client root containing genro-dom-js, genro-bag-js and genro-tytx |

Exact Python packages are in `requirements.lock`; React/Vue and test tool versions
are in their npm lockfiles. [Dependency provenance](docs/dependency-baseline.json)
records local source hashes and revisions. The source overrides are intentionally
visible instead of presented as a portable pip installation. To run only the
React/Vue portion without Pages sources, use `ROSETTA_WITH_PAGES=0 ./scripts/run.sh`.

## Verify and compare

Start the server in another terminal, then install the browser once and run checks:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/demo-rosetta-browsers npx playwright install chromium
./scripts/check.sh
```

Browser contracts run sequentially against all three versions and reset the shared
fixture data. Use a dedicated demo server while testing. `ROSETTA_URL` changes the
browser target. The suite covers local calculation, discarded drafts, persistence,
reset, server/network errors, pending requests, initial-load retry and small screens.

Read [the comparison](docs/COMPARISON.md), [work status](docs/STATUS.md), and
[the evolution protocol](docs/EVOLUTION.md). Reproduce the source inventory with:

```sh
.venv/bin/python scripts/measure.py
bash -c 'source scripts/environment.sh; .venv/bin/python scripts/dependencies.py'
```

Source counts separate application code, the Pages host adapter, shared code and
setup. They are not a readability score or a claim that one framework wins.
Framework-specific development notes: [React](docs/react.md), [Vue](docs/vue.md),
[Pages](docs/pages.md).

## Worktrees

The canonical checkout is `/Users/gporcari/Sviluppo/genro_ng/demo-rosetta` (`main`).
Four isolated development worktrees live under
`/Users/gporcari/Documents/ChatGPT/genro-pages/temp/demo-rosetta-worktrees/`:
`integration`, `react`, `vue`, `pages`, with corresponding `codex/*` branches.
React, Vue and Pages work was delegated to Sol; the coordinator integrates changes
and verifies the common contracts. Worktrees are preserved for later iterations.

For each new feature, update the common specification, change the implementations
in their worktrees, and only advance the baseline once the shared checks pass.
Grid-based editing remains a future revision once the real component is available.
