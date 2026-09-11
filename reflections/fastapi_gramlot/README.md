# FastAPI + Gramlot: automatic page discovery

This reflection consumes the installed Gramlot FastAPI adapter. It no longer
copies adapter code into common/ and requires no per-application main.py or JSON.
The minimal example consists of pages/hello.py, pages/alfa.py and pages/beta.py
under applications/example. Each defines Page(WebPage), optional title, and main(root).

From this reflection directory:

```sh
.venv/bin/gramlot fastapi serve applications/example --port 8046
```

Or from applications/example:

```sh
../../.venv/bin/gramlot fastapi serve --port 8046
```

Open http://127.0.0.1:8046/page/. The index is generated in filename order.
Restart the server after editing page files. Underscore files and subdirectories
are ignored; invalid page classes fail at startup with their filename.

The optional run.py shows two collections registered on an existing FastAPI app:

```sh
.venv/bin/python -m uvicorn run:app --port 8044
```

It exposes /page/ and /other/. This is advanced integration, not required for
the minimal application. The CLI intentionally does not load custom main.py.

## Installation

The current alpha is not yet published. From this directory:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install '../../.local/packages/gramlot-0.1.0a1-py3-none-any.whl[fastapi]'
```

Use a wheel built after the adapter was added; alpha filenames are reused during
development. No frontend build is required for these Python pages. The wheel
contains the runtime and adapter assets. No Genro ASGI dependency is involved.

## Where the shared code lives

Read gramlot.contrib.fastapi.application (GramlotApplication and PageCollection),
runtime (asset mappings), and frontend/entry.js (browser startup) in the Gramlot
repository. The adapter is a shared library cost, not hidden application code.
See Gramlot docs/fastapi.md for the complete convention and current limitations.
