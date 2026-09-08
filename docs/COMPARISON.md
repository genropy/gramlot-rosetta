# Hello World comparison

The active baseline is a static title and greeting, specified in SPEC.md. The
plain HTML frame is shared by all implementations and excluded from application
code. Each implementation renders its own isolated document.

| Application source | Nonblank lines | Bytes |
| --- | ---: | ---: |
| React App.jsx | 9 | 125 |
| Vue App.vue | 4 | 71 |
| Pages recipe.py | 10 | 445 |

These are literal file counts, including imports, declarations and documentation.
Pages expresses the visible content in two builder calls. Vue expresses it in two
HTML elements. This small example does not establish an advantage for complex
pages or authoring with an LLM.

See source-inventory.json for separately measured bootstrap, adapters, framework
setup, shared frame and source viewer. Run scripts/measure.py to regenerate it.
The current Pages adapter still lives in the demo and relies on local dependency
checkouts; it is not yet a packaged library integration.

The source viewer opens the individual page first and offers the common HTML
frame separately. This keeps navigation out of the code being compared without
hiding the supporting implementation.

The previous order comparison is preserved in
../standby/orders/baseline-COMPARISON.md. Its measurements do not describe the
active Hello World demo.
