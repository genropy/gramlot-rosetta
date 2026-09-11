# Rosetta specification — Hello World teaching restart

Owner-approved scope, September 11, 2026. This supersedes the earlier progressive
gallery contract preserved in standby/progressive/previous-SPEC.md.

## Active lesson and presentation

Hello World and Data binding are active in Gramlot Python, Gramlot JS, React, Vue and NiceGUI.
In the first lesson, each renders one h1 containing "Hello World". No editable field, sample label,
style controls, binding or business API belongs to this first lesson. Teaching
explanations belong in the shared frame, outside the executable recipe.

The shared plain HTML frame selects an implementation. Each live example runs in
its own iframe, beside a source iframe; the source stacks below at narrow widths.
The frame itself does not depend on any compared frontend. Gramlot may expose its
standard inspector as a library tool; it is not authored in the Hello World recipe.

CodeMirror displays the exact executed page source with language highlighting.
All sources are read-only except Gramlot JS's Page recipe. Run explicitly applies
that recipe; Reset restores both original code and preview. Invalid code reports
an error and retains the last successful preview. Reload discards local edits.
Supporting source tabs remain read-only, including Gramlot JS Boilerplate/Common.

The master page has a left navigation tree: Overview contains Introduction, the
five implementation boilerplates and Shared infrastructure. Simple examples
contains Hello World and Data binding. Lesson source panes show only authored recipe/component
code; supporting code is accessed through Overview, never through lesson tabs.
Raw source is available without interpreting markup or permitting arbitrary files.

## Authoring and hosting

Gramlot Python uses Page(WebPage) with a single main() and one h1 declaration.
Gramlot JS uses one top-level root.h1 statement. Keep future recipes compact until
real reuse or complexity warrants a helper; do not split trivial examples.
React uses a functional component; Vue uses an SFC; NiceGUI declares the same
heading in its page function. Common styling stays outside all five examples.

Gramlot's installed optional FastAPI adapter discovers pages/ and owns Python
recipe execution, typed transport and runtime delivery. Rosetta adds only shared
presentation CSS to its generated HTML. Gramlot JS reuses the same adapter assets
and import map but owns a small local editing harness. NiceGUI is mounted through
its native FastAPI integration. Framework code is never copied into the consumer.

Keep /pages and /pages-js identifiers stable. Only hello-world and data-binding are accepted by the
comparison, example and source routes. Later lesson files remain preserved, but
React and Vue must not import them into the active build. Former lesson tests are
retained under standby/progressive/tests until those lessons are reintroduced.
Orders and standalone reflections stay outside active routes.

## Acceptance

Verify all five headings and sources, CodeMirror permissions, desktop adjacency,
narrow-screen stacking, JS explicit execution/reset/error recovery/reload,
NiceGUI's browser connection, adapter-owned source/assets, and rejection of
inactive lessons and unlisted source paths. Keep page, integration and editor
costs distinct; this static lesson is not a performance comparison.

## Presentation refinement

The left tree uses compact rows. Desktop navigation and example/code columns have
pointer- and keyboard-operated separators; widths persist locally, and double-click
restores defaults. Narrow screens stack content and hide the corresponding handles.
The master uses a small framework-independent script for these presentation controls.

Gramlot's inspector is opened by a discreet magnifying-glass button immediately
below the live iframe. The library launcher is hidden in the example; Rosetta
invokes that current instance without copying or changing framework code.
Open source and Open raw links are removed from the UI; code remains in CodeMirror.
The raw endpoint remains available for tooling and exact-source verification.

The Inspector floating window is mounted in the master document, so its movement
and resizing are bounded by the page viewport rather than the example iframe.
It retains the example's application and typed Bags. Run/Reset or frame reload
dispose the old tool; reopening inspects the current example instance.

## Lesson 02 — Data binding

Two independent heading/textbox pairs are stacked vertically, each initialized
to "Hello World". Live updates its heading on input; On focus out commits when
focus leaves the field. Gramlot uses separate Data fields and reactive bindings,
with live=True only on the first textbox; the second uses the default.
React uses two states with change/blur handlers, Vue two refs with v-model/blur,
and NiceGUI a per-page dictionary with value binding/blur handling.
Text is displayed literally, including markup characters. The source pane shows
the exact recipe, editable only for Gramlot JS, with Run and Reset for both pairs.

## Lesson 03 — Input widgets

Input widgets is active in all five implementations. Six labelled fields (Name,
Quantity, Date, Time, Updates, Notes) demonstrate text, number, date, time, checkbox
and multiline editing. Gramlot uses a responsive formlet and separate Data bindings;
React/Vue use CSS Grid and local state, NiceGUI uses a grid and per-page state.
Fields start empty, Updates starts unchecked. No submission or persistence is added.
Date/time editors use local browser controls; Gramlot retains its typed Data values,
while React/Vue/NiceGUI retain native date/time strings for this UI-only comparison.

Owner refinement: the Input widgets lesson uses two fixed columns in all versions.
The Gramlot null checkbox uses a compact outlined box with a small gray dash.

## Lesson 04 — Contact box

Contact box is active in all five versions. First name, Last name, Phone and Email
are grouped under a centered white Contact details label on a dark title bar.
Gramlot uses labledBox(datapath='contact') and a two-column formlet whose fields
use relative ^.first_name, ^.last_name, ^.phone and ^.email bindings. Each field
commits on focus out. Other implementations keep one local contact object.
No validation, submission or persistence is introduced by this lesson.

## Lesson 05 — Repeated contacts

Contact cards have compact padding and rounded corners. Repeated contacts adds
six independent copies through a loop, arranged by an outer formlet in Gramlot
and a responsive grid in the comparison versions. Gramlot box datapaths are
c1 through c6, while all inner bindings remain relative. Each lesson is autonomous.
All four fields and focus-out behavior remain the same as Contact box.

Repeated contacts extracts the reused card into contact_box (Python) / contactBox
(JavaScript), with a one-line description. The main loop only calls that helper.

Contact lessons now use CSS classes in every implementation. Gramlot labledBox
exposes box/label/content CSS parts; recipes retain structure, binding and label
placement while shared/contacts.css owns card presentation. Lesson source tabs
show the executed recipe, Contact styles and Shared field styles. CSS stays
read-only; only the Gramlot JS app recipe is editable.

## Lesson 06 — Contact colors

Contact colors preserves the six independent cards and adds one Background color
picker per card, initially white. In Gramlot, the card background and the picker
share ^.color under each card's datapath. The picker uses live=True. The title bar
retains its dark styling. React/Vue bind background styles to local state; NiceGUI
updates the card style on color change. Sources include shared CSS as before.

Owner correction: Contact colors changes the title bar background only. The
picker starts at #29384d, and the card body remains white. Gramlot binds
label_background to ^.color.

Owner correction: shared example CSS is shown once in Overview > Example styles.
Lesson source panes show only their own recipe; shared CSS tabs are no longer
repeated across lessons and implementations. Shared infrastructure remains separate.

Each lesson ends with a short English How it works paragraph specific to the
selected implementation. These explanations stay in the shared frame and describe
the executed recipe, state ownership and update behavior.

React, Vue and NiceGUI lessons also include How it compares. Comparisons concern
the displayed implementations, distinguish built-in semantics from reusable
application abstractions, and explicitly acknowledge parity where appropriate.
Do not present syntax length, hidden CSS or hypothetical ecosystem limits as
semantic advantages.

Comparison principle: distinguish built-in functionality from functionality
obtainable by writing wrappers, extra components or adding libraries. Equivalent
results do not imply equal application work. Gramlot helpers that compose widgets
must not be confused with implementing scope, binding or commit behavior itself.
Acknowledge features already built into the compared framework as well.

## Visual builder PoC

The owner authorized a separate `/builder/` experiment: catalogue drag/drop,
valid/invalid target borders, Source tree, move/delete/reorder and attribute editing
against a mounted Source Bag. See docs/VISUAL-BUILDER-POC.md for scope and limits.
This is not a comparative lesson and does not reactivate other parked PoCs.
