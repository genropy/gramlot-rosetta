# Work status — Rosetta v1

- Repository: local-only `demo-rosetta`, no remote or publication.
- Shared FastAPI backend and fixtures: implemented.
- React: implemented with native controls; Vite build passes.
- Vue: implemented with native controls; Vite build passes.
- Pages: implemented using existing WebPage/WidgetTestBuilder and DOM components.
- Genro-asgi: absent from the isolated Python runtime, asserted by tests.
- Local Pages/Builders/DOM source dependencies: still required and documented.
- Grid and richer widgets: intentionally absent; no surrogate component was added.
- Shared behavioral verification: 16 Python contracts and 21 browser scenarios.
- Source inventory and comparison: recorded separately from framework/setup costs.

Completed on 2026-09-08. The documented setup command succeeds from the canonical
checkout; its server hosts all three apps at port 8026. Final verification passes
16 Python contracts, Ruff and all 21 shared Chromium scenarios, including visible
labels, selected-order ARIA, decimal validation and double submission prevention.
Desktop/mobile screenshots are retained locally under .local/screenshots/.
The source-dependency fingerprint matches the recorded baseline unchanged.

The repository keeps the integration, React, Vue and Pages branches/worktrees for
future aligned revisions. It does not alter the current Genro libraries or their
active development branches. See EVOLUTION.md before extending the demo.
