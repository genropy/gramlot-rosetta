# Gramlot Rosetta

A progressive comparison of Gramlot Python, Gramlot JS, React, Vue and NiceGUI.
The current lessons are **Hello World**, **Data binding**, **Input widgets**, **Contact box**, **Repeated contacts** and **Contact colors**, with the example on
the left and its actual source in CodeMirror on the right. On narrow screens,
source follows the preview. Explanations stay outside the executable examples.

Choose an implementation using the five tabs. Python, JSX, Vue and supporting
sources are read-only. Only the Gramlot JS Page source is editable: **Run** applies
the recipe; **Reset** restores the original code and page. A failed recipe leaves
the last successful preview visible. Reload discards edits; nothing writes to disk.
The left navigation groups Overview and Simple examples. Overview contains an
introduction, reusable setup for each version and shared infrastructure. Lesson
panes show only their authored page code. All five implementations render a semantic h1 with the same greeting.

## Run

Requires Python 3.12+, uv and Node compatible with Vite 8.

```sh
git clone https://github.com/genropy/gramlot-rosetta.git
cd gramlot-rosetta
ROSETTA_GRAMLOT_WHEEL=/absolute/path/gramlot-0.1.3-py3-none-any.whl ./scripts/setup.sh
./scripts/run.sh
```

Open [Rosetta](http://127.0.0.1:8026/). `ROSETTA_PORT` changes the port.
The development checkout may retain a current wheel in `.local/packages/` as a
setup fallback. A new clone can use the published Gramlot 0.1.3 wheel.
NiceGUI and the other Python dependencies are recorded in `requirements.lock`.

Gramlot Python uses `gramlot.contrib.fastapi.mount_gramlot`, which discovers
`frontends/pages/pages/hello-world.py`. The library owns recipe serialization,
startup and runtime asset delivery. Rosetta adds shared presentation CSS to the
adapter's HTML response without replacing its startup. The JS laboratory reuses
the adapter's import map and installed runtime with its own execution harness.
There is no copied Gramlot runtime or Genro ASGI dependency.

`ROSETTA_GRAMLOT_ROOT=/path/to/gramlot ./scripts/setup.sh` can instead build and
install that checkout, provided its browser resources have already been prepared
there. Setup does not modify sibling sources. Python and JS always come from the
same installed package; the former run-time PYTHONPATH override is retired.
Rebuild/reinstall after framework changes, then restart Rosetta and reload.

Setup copies the installed wheel's verified, content-versioned browser distribution
byte for byte under `shared/gramlot/` and adds Rosetta's small consumer harnesses.
Development and production therefore use the same framework browser build. Set
`GRAMLOT_ROSETTA_MODE=production` to serve that immutable payload; startup fails
clearly if it is missing.

NiceGUI uses its native `ui.page` and `ui.run_with` integration under
`/examples/nicegui`; it owns its browser connection. See the
[official FastAPI example](https://github.com/zauberzeug/nicegui/blob/main/examples/fastapi/main.py).
This first static lesson makes no performance or reactivity comparison claim.

## Verify

With Rosetta running in another terminal:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/demo-rosetta-browsers npx playwright install chromium
./scripts/check.sh
.venv/bin/python scripts/dependencies.py
.venv/bin/python scripts/measure.py
```

`ROSETTA_URL` selects a different server for browser tests. The checks cover all
five implementations, exact source display, read-only editors, JS Run/Reset/error
recovery, NiceGUI connectivity, inactive lessons and the narrow-screen layout.
Source inventory covers the active lesson and shared code; it does not measure
runtime download size or use line counts as a framework quality score.

## Preserved work

The previous eight later lessons remain in `frontends/*/examples`, excluded from
active routing and frontend builds. Their former browser suite and specification
are preserved in [standby/progressive](standby/progressive/README.md). They need
review against current APIs before returning one teaching step at a time.
[Orders](standby/orders/README.md) remains parked.
[Reflections](reflections/README.md) contains the independent FastAPI experiments.

Keep Gramlot recipes in one `main()` or top-level JS until actual reuse or
complexity justifies helper routines. See [SPEC.md](SPEC.md) for the active contract
and [migration record](docs/GRAMLOT-MIGRATION.md) for provenance. Older comparison
and evolution documents describe previous snapshots, not this lesson's results.

The navigation tree is compact. Drag either vertical divider to resize the tree
or the live example/code panes; arrow keys also work, double-click resets, and
widths are remembered locally. A small magnifying glass below Gramlot examples
opens the Inspector. Source stays in the code pane without separate open/raw links.

## Install as a Chrome app

Start Rosetta, then open its URL in Chrome. Use Install app when shown, or Chrome's
installation action in the address bar/menu. Rosetta opens in a standalone window
with its own icon. Keep the same hostname and port for the installed app.

The installation is a web app, not a bundled Python distribution. Its FastAPI
server must remain running, including for Python and NiceGUI examples. When the
server is unavailable, the app offers a retry page. Recipes and runtime assets
are fetched from the server on each load rather than cached for offline execution.
Localhost and 127.0.0.1 work locally; a hosted installation requires HTTPS.
