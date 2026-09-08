# Rosetta specification — v1

Status: implementation baseline derived from the owner's approved minimal comparison.
The project compares authoring effort, not which framework can create the most features.

## Common behavior

All three applications use the same FastAPI HTTP JSON API and the same seed orders.
They are served at /react/, /vue/ and /pages/. Navigation links allow switching
implementation. Use ordinary list buttons; no grid, editable rows, authentication,
router library, remote resolver, WebSocket, or new web component.

1. Load three orders. Automatically select the first. Each list button displays its
   ID and saved customer. Buttons have data-testid="order-1" etc.
2. Edit Customer (text, data-testid="customer"), Quantity (number,
   data-testid="quantity"), Note (text, data-testid="note"), Fulfilled (checkbox,
   data-testid="fulfilled"). Product and unit price are read-only.
3. Show the local derived total, formatted as EUR 00.00, in data-testid="total".
   A committed quantity change must update it without any HTTP request. Input
   keystroke timing may differ by framework; the shared contract commits by blur.
4. Selecting another order discards unsaved edits. Editing must not change the saved
   order list until Save succeeds. Selection clears previous feedback.
5. Save (data-testid="save") sends PUT /api/orders/{id} with customer, quantity,
   note, fulfilled only. Do not use native required/min validation to hide the server
   validation behavior. The server rejects blank/whitespace customer, quantities not
   integer 1..100, notes >200 characters and non-boolean fulfilled. Show a readable
   server/network error in data-testid="feedback", role="status". Keep edits after
   failed saves. Success message is exactly "Order saved." and updates the list.
6. Disable Save, editing and order selection while a save is pending to avoid stale
   replies overwriting another draft. Prevent double submission.
7. A Reset demo button (data-testid="reset") calls POST /api/reset, reloads seed
   state and first selection. Disable actions while reset/load is pending. Initial
   load failures must be visible and Reset demo must allow retry.
8. Save persists across page reloads in this running single-process demo. Restarting
   the server resets data. All variants intentionally share the same server data.

Provide visible labels and keyboard-operable controls, an explanatory hint about
blur/selection/reset, and a compact responsive two-column layout collapsing on small
screens. Use shared /shared/style.css. No CSS targeting inside web-component shadow
roots. Browser tests may locate their native inputs through open shadow roots.

## API

GET /api/orders -> JSON array of objects:
{id, customer, product, quantity, unit_price_cents, note, fulfilled, total_cents}.
PUT /api/orders/{id} -> updated object. Invalid input -> 422 with
{"detail": "readable message"}. Missing order -> 404. POST /api/reset -> seed array.
The server computes total_cents; the client never sends it. JSON numbers are used
for quantities and integer cents; currency rendering uses two decimal places.

Seed data lives in shared/orders.json. No implementation owns alternative fixtures.
Pages may expose GET /pages/recipe returning a typed Python-authored recipe. Its
page-specific Python and JavaScript integration both count as authored code.
The Python recipe must use the real genro_pages.page.WebPage and existing builder
and DOM APIs. Keep genro-asgi absent from the demo Python environment, documenting
any dependency-installation workaround. Do not claim a released agnostic package.

## Evidence and evolution

Run one browser contract against all three versions, plus backend API contracts.
Record exact dependency versions, reproduction commands, shortcomings and observed
results. Count application code separately from shared backend/styles, adapters,
setup and tests; never present line count as proof of readability or a winner.
Future grid or other capabilities are separate specification revisions applied to
all implementations. Pending parity is explicit; do not compare mismatched scope.
