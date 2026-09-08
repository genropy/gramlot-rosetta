# Demo Rosetta

The active comparison is **Hello World** in React, Vue and Genro Pages, hosted by
FastAPI. One shared **plain HTML frame** owns implementation navigation, example
selection and View source. Each framework renders only the example in its iframe.

The page itself contains exactly a heading and a div saying **Hello World**.
Orders is on standby: its previous code, fixtures, specification and tests are
preserved in [standby/orders](standby/orders/README.md), outside active routes/tests.

## Run

Prerequisites: Python 3.12, uv, Node compatible with Vite 8 and npm.

```sh
./scripts/setup.sh
./scripts/run.sh
```

Open [Pages](http://127.0.0.1:8026/pages/), [React](http://127.0.0.1:8026/react/), or
[Vue](http://127.0.0.1:8026/vue/). View source opens the individual page source first;
the common HTML frame, bootstrap and host adapter are separately inspectable.

Pages still needs the verified local source paths in scripts/environment.sh.
Override ROSETTA_PAGES_SOURCE, ROSETTA_BUILDERS_SOURCE and ROSETTA_CLIENT_MODULES
on another checkout. [Dependency provenance](docs/dependency-baseline.json) records
the original sources. The isolated environment has no genro-asgi installed; this
is not yet the intended released Pages/FastAPI adapter distribution.
ROSETTA_WITH_PAGES=0 runs only the other two frontends. ROSETTA_PORT changes the port.

## Verify

With a separate demo server running:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/demo-rosetta-browsers npx playwright install chromium
./scripts/check.sh
.venv/bin/python scripts/measure.py
```

ROSETTA_URL selects another server for browser checks. Active tests cover the shared
HTML frame, isolated Hello World content, mobile layout and literal source display.
The previous order tests are preserved under standby/orders/tests, not run against
Hello World. See [SPEC.md](SPEC.md), [comparison](docs/COMPARISON.md) and
[evolution](docs/EVOLUTION.md). Application code and comparison infrastructure are
measured separately. Readability takes precedence over minimizing line count.

The repository is local-only at /Users/gporcari/Sviluppo/genro_ng/demo-rosetta.
Four codex/* worktrees are preserved under
/Users/gporcari/Documents/ChatGPT/genro-pages/temp/demo-rosetta-worktrees/.
No Genro dependency repository is modified by this demo.

Pages JS is available at `/pages-js/`. Its Page tab is a live CodeMirror editor:
edit the JavaScript recipe and press Apply, choose Live for each edit, or Focus out when leaving the editor. Edits are not saved to files. Reload
restores the original recipe. `scripts/setup.sh` builds the local editor bundle;
run `npm run build:editor` after changing editor code. The runtime and editor are
listed separately from the authored recipe in the source browser and inventory.

The example menu now offers seven cumulative, independently authored pages in
each of the four variants. Start with `/pages/editable-text/` or explore the
complete set of controls at `/pages/font-style/`. Switching implementation keeps
the example selected. See SPEC.md for update events and initial values.
