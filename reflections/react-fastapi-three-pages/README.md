# React + FastAPI: three pages

This independent example was requested during the Gramlot/FastAPI adapter
conversation. It makes the complete hosting and browser bootstrap visible.
It does not import Rosetta or Gramlot and is not part of the main gallery.

## Behavior

| URL | Result |
| --- | --- |
| /page/ | Three links: Hello, Alfa, Beta |
| /page/hello/ | Hello World |
| /page/alfa/ | Alfa page |
| /page/beta/ | Beta page |

Links perform document navigation. No client routing library, backend data API,
SSR or state synchronization is used.

## Files to author

```text
main.py                 FastAPI routes and static asset mount
requirements.txt        Direct Python dependencies
frontend/package.json   Frontend dependencies and build command
frontend/index.html     Shared HTML entry document
frontend/main.jsx       Index links, URL selection and React mounting
frontend/pages/Hello.jsx
frontend/pages/Alfa.jsx
frontend/pages/Beta.jsx
```

These are eight authored application/configuration files. package-lock.json and
requirements.lock additionally record dependency versions. README files are
explanation, not runtime infrastructure. node_modules, .venv and frontend/dist
are generated locally and excluded by the repository ignore rules.

## Install and run

Run these commands from this example directory. Use Python 3.11+ and a Node
version supported by the locked Vite 8 release (Node 20.19+ or 22.12+ on the
corresponding supported lines; the original run used Node 23.11.0).

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.lock
npm --prefix frontend ci
npm --prefix frontend run build
python -m uvicorn main:app --host 127.0.0.1 --port 8041
```

Open http://127.0.0.1:8041/page/ . Port 8041 keeps this experiment separate from
the main Rosetta server. Any free port can be supplied to Uvicorn. Build before
starting FastAPI: its static mount expects frontend/dist/assets to exist.

After a JSX change, rebuild and reload the browser. Uvicorn's optional --reload
only reloads Python; it does not build the frontend. No Vite development server
or proxy setup is included in this deliberately small baseline.

## Request flow

1. FastAPI returns the shared built index.html for /page/ or an allowed page name.
2. The browser requests the compiled JavaScript from /page/assets/.
3. main.jsx selects a component from the URL, or the three-link index.
4. React mounts it in the document's root element.

All three components are statically imported into one frontend build. Python
validates the three names and JavaScript also maps them to components: the name
list is duplicated in this example. FastAPI never executes the JSX component.
Unknown page names receive HTTP 404 from FastAPI.

## Comparison questions

For a future Gramlot equivalent, keep the same four URLs and visible behavior.
Compare the page code separately from the HTML/bootstrap, host registration,
dependency setup and build/reload cycle. React's shared infrastructure is paid
once for the three pages, not three times. Likewise, an adapter may supply shared
Gramlot infrastructure rather than requiring the application author to copy it.

This example does not establish that React always requires eight files, or that
Gramlot already provides a FastAPI contrib adapter.

## Verification

The initial temporary example was built and checked in Chromium: the index and
all three headings rendered. This directory preserves that runnable source with
its lockfiles. After relocation, npm ci and the production build passed. Chromium
followed all three index links and verified their headings; an unknown page
returned HTTP 404. The standalone server was started on port 8041.
