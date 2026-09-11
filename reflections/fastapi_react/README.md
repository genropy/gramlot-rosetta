# Shared FastAPI + React integration

A second reflection, separate from both the original standalone example and the
main Rosetta gallery. Common infrastructure is authored once; application pages
remain ordinary React components. Nothing here changes Gramlot's public API.

## Layout

```text
fastapi_react/
├── common/
│   ├── hosting.py          # reusable FastAPI routes and static mounting
│   ├── build.mjs           # one Vite build recipe for all applications
│   └── frontend/
│       ├── index.html      # shared initial document
│       └── entry.jsx       # shared index, URL selection and React mounting
├── applications/
│   ├── example/
│   │   ├── main.py         # creates FastAPI and mounts its built frontend
│   │   ├── application.json
│   │   └── pages/          # Hello.jsx, Alfa.jsx, Beta.jsx
│   └── other/
│       ├── main.py
│       ├── application.json
│       └── pages/Welcome.jsx
├── run.py                  # optional combined demonstration
├── package.json            # one set of JS dependencies
├── package-lock.json
├── requirements.txt
└── requirements.lock
```

`common/__init__.py` also marks the shared Python package. Python and npm
dependencies are installed once at this project root. No application has to copy
the HTML document, createRoot call, static hosting implementation or Vite setup.

## What the application author writes

For the three-page example, **five files**: three components, application.json,
and main.py. In an existing FastAPI application the latter is just a mount call.
The common infrastructure is additional code maintained once; it must remain
visible in comparisons rather than being charged to each page or ignored.

`application.json` is the single authored page registry:

```json
{
  "title": "Three pages",
  "prefix": "/page",
  "pages": {
    "hello": {"label": "Hello", "source": "pages/Hello.jsx"},
    "alfa": {"label": "Alfa", "source": "pages/Alfa.jsx"},
    "beta": {"label": "Beta", "source": "pages/Beta.jsx"}
  }
}
```

The application's Python entry is:

```python
from pathlib import Path
from fastapi import FastAPI
from common.hosting import mount_react

app = FastAPI()
mount_react(app, Path(__file__).parent / 'dist')
```

Build the frontend before starting FastAPI. Adding a page means writing its
component and adding one registry entry, then rebuilding; the shared entry and
Python route code do not change. Renaming a prefix requires rebuilding and
restarting the host because asset URLs and routing must change together.

## Run

From this directory, with Python and Node/npm installed (verified with Python
3.14.6 and Node 23.11.0):

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.lock
npm ci
npm run build
python -m uvicorn run:app --host 127.0.0.1 --port 8042
```

- http://127.0.0.1:8042/page/ — Hello, Alfa and Beta links.
- http://127.0.0.1:8042/other/ — the second application's Welcome link.

Each application can instead run on its own, from this same project root:

```sh
python -m uvicorn applications.example.main:app --port 8042
python -m uvicorn applications.other.main:app --port 8043
```

These are alternative launches: stop any process already using the selected
port. The combined runner simply mounts both frontends on one FastAPI instance.

Build only one application with `npm run build -- example`; omit its name to
build all application directories. After JSX edits, rebuild and refresh. No
Vite development server, HMR or client navigation framework is introduced here.

## How sharing works

1. The shared build reads an application's registry and supplies its component
   imports to the shared React entry through a small Vite virtual module.
2. Vite compiles the shared HTML/entry and the application's components into
   that application's dist directory, with its own asset URL prefix.
3. The same build writes a reduced application.json containing the prefix and
   page names beside the assets. FastAPI reads this generated manifest at startup.
4. Common hosting returns index.html for the index and known pages, serves assets
   and returns HTTP 404 for unknown names. It never executes React components.
5. The browser chooses the component or generated navigation list from the same
   registry. Links use normal document navigation.

No page-name list is manually duplicated between Python and JavaScript. Shared
source and dependencies do **not** imply one shared deployed bundle: each app
gets its own build, including React, so it can be deployed separately. Deploy a
complete dist directory, including its generated application.json. The original
source registry and virtual module are build inputs, not runtime Python imports.

The helper supports these small registered pages. Authentication, request data,
client routing, per-app dependency versions, SSR and hot reload are separate
choices, not features claimed by this example. It is a reusable local integration,
not a newly published framework.

## Verification

npm ci and both production builds passed. Browser verification exercises all
three original page links, the second app's Welcome page and 404 responses for
cross-application page names. No browser page errors were observed.

## References

- [Vite JavaScript build API](https://vite.dev/guide/api-javascript.html)
- [FastAPI APIRouter composition](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
