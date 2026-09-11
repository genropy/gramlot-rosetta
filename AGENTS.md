# Gramlot Rosetta

This is an independent comparison repository, not a Genro library.
Read SPEC.md before changing an implementation. Keep the same behavior and fixtures
in React, Vue and Genro Pages. Do not introduce a grid or unavailable Genro widgets.
Use existing libraries; do not copy or patch their runtime code into this repository.
Keep framework integration costs visible. Record limitations rather than claiming
features which were not verified. Code, UI and documentation are English.

Work in the assigned Git worktree and restrict edits to the assigned paths.
The coordinator integrates commits and runs the shared behavioral checks.
The owner authorized public publication to genropy/gramlot-rosetta. Do not change
sibling repositories or publish additional artifacts without task authorization.
User permits delegation to gpt-5.6-sol. Keep tasks concrete and bounded.

## Readable page authoring

The introductory examples through Font style use one Python main() and top-level
JavaScript, without separate helper methods. Local scope also stays in main(). Repeated panels adds only text_panel(),
which is actually reused by the loop. Split methods when reuse or complexity
justifies it; subdivision is not a framework requirement. Prefer readability for a Python author reviewing LLM-generated code.
Keep actual sources available from each demo implementation, including any Pages
JavaScript/controller and adapter code needed to understand the full application.

## Common frame and current scope

Rosetta navigation, example selection and source links belong in the shared pure
HTML frame, outside all framework page recipes/components. Each framework renders
only the selected example in an iframe. Hello World, six cumulative binding examples and Local scope are active; Orders
is preserved in standby/orders and must not reappear until the owner requests it.
A two-statement Hello World main() does not need artificial helper methods.

## Semantic comparison and code ownership

Focus comparisons on semantic differences: how a page declares structure, state,
reactivity, events and server interactions. Avoid conclusions based on syntax or
incidental boilerplate. Distinguish code attributable to an individual page from
context shared by all pages: application startup, navigation, host integration,
reusable components and common policies. Expose both in the source viewer and
report them separately; shared costs remain visible but are not charged to every
page. Allow idiomatic reuse in every framework under the same behavior contract.

Examples are autonomous: each owns all its state and behavior and must not import
another example. Use concise documented methods without a build_ prefix.

## Gramlot migration

Read docs/GRAMLOT-MIGRATION.md and README.md for current setup. Python and browser
sources come from one Gramlot checkout. Legacy Pages/DOM setup notes are historical.
Keep /pages and /pages-js route identifiers stable; visible labels use Gramlot.

## Teaching restart — owner instructions, 2026-09-11

The current SPEC.md supersedes earlier active-gallery statements above. Initially
show only Hello World in Gramlot Python, Gramlot JS, React, Vue and NiceGUI. Use a
live panel beside actual source in CodeMirror; only Gramlot JS Page is editable.
Keep Gramlot code compact until actual reuse/complexity needs routines. Consume
the current installed gramlot.contrib.fastapi adapter. Later lesson sources and
reflections are preserved, not automatically scheduled for reactivation.

The master navigation now groups Overview (Introduction, each implementation's
shared setup, Shared infrastructure) and Simple examples (Hello World only).
Lesson source panes contain page code only; reusable boilerplate belongs in Overview.

## Lesson 02 — owner instruction, 2026-09-11

Data binding is now active alongside Hello World in all five versions. It uses a
labelled Message textbox and a heading bound to the same state, updating on focus out (the textbox default).
Gramlot recipes use one Data field and two ^message bindings in three statements.
Other preserved lessons remain inactive.

Owner refinement: lesson 02 now compares two independent stacked pairs, Live
(`live=True`) and On focus out (default), in every implementation.

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
