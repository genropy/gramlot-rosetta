# Demo Rosetta

This is an independent comparison repository, not a Genro library.
Read SPEC.md before changing an implementation. Keep the same behavior and fixtures
in React, Vue and Genro Pages. Do not introduce a grid or unavailable Genro widgets.
Use existing libraries; do not copy or patch their runtime code into this repository.
Keep framework integration costs visible. Record limitations rather than claiming
features which were not verified. Code, UI and documentation are English.

Work in the assigned Git worktree and restrict edits to the assigned paths.
The coordinator integrates commits and runs the shared behavioral checks.
The owner authorized public publication to genropy/demo-rosetta. Do not change
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
