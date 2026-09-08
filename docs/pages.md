# Genro Pages implementation

The Pages variant is served at `/pages/` by a small FastAPI adapter. Its static
interface is authored in `frontends/pages/recipe.py` with the real `WebPage` and
`WidgetTestBuilder` classes. The browser receives that SourceBag as TYTX from
`/pages/recipe`; `app.js` mounts it with the existing DOM runtime and constructs
the API-backed order buttons through the runtime's source-mutation API. Those
dynamic buttons are therefore JavaScript-authored source nodes and are counted as
controller/integration code, not as Python recipe authoring.

The integration deliberately keeps its costs visible. Pages currently declares
`genro-asgi` as a mandatory distribution dependency, although `WebPage` and
`WidgetTestBuilder` do not themselves import it. The demo therefore does not
install the `genro-pages` distribution. It places the canonical Pages source and
the experimental Builders source on `PYTHONPATH`, alongside the demo checkout:

```sh
export PYTHONPATH="$PWD:/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-pages/src:/Users/gporcari/Documents/ChatGPT/genro-pages/worktrees/genro-builders/src"
export ROSETTA_CLIENT_MODULES="/Users/gporcari/Sviluppo/genro_ng/meta-genro-modules/sub-projects/genro-pages/temp/client-releases-20260908"
.venv/bin/python -m uvicorn backend.app:create_app --factory --port 8026
```

`ROSETTA_CLIENT_MODULES` is optional and defaults to the path shown above. It must
point to the tested client tree containing `genro-dom-js`, `genro-bag-js`, and
`genro-tytx`. No runtime code is copied into this repository.

The verified baseline is canonical Pages commit
`25a8f9bfb3398eca85c0127ecef8733935dbf7a5`, experimental Builders commit
`c6e4684914db4f3fd72c8f53b39ca270bfb6d89e`, DOM snapshot revision
`eaaa0ac0a582cc8f9abada1cdddf699cd0e66bbc`, genro-bag 0.21.1,
genro-bag-js 0.4.0, and genro-tytx 0.15.0. The integration environment used
FastAPI 0.141.1.

The existing `textBox`, `numberTextBox`, and `checkbox` components provide the
editable controls. Native recipe buttons provide selection, Save, and Reset.
`dataFormula` computes the displayed total locally. The current number component
writes strings, so the formula and JSON adapter explicitly convert quantity with
`Number`; server validation remains authoritative.

The JavaScript controller is required because this Pages slice has no verified
declarative HTTP JSON service for loading and saving the common REST resource. It
keeps saved orders separate from the draft, disables the recipe through a pending
datum, reports errors, and owns an `AbortController`. A `pagehide` listener aborts
the active request and disposes the Pages application. This adapter and controller
are counted separately from the Python recipe when comparing authored code.
