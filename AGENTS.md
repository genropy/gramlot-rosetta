# Demo Rosetta

This is an independent local comparison repository, not a Genro library.
Read SPEC.md before changing an implementation. Keep the same behavior and fixtures
in React, Vue and Genro Pages. Do not introduce a grid or unavailable Genro widgets.
Use existing libraries; do not copy or patch their runtime code into this repository.
Keep framework integration costs visible. Record limitations rather than claiming
features which were not verified. Code, UI and documentation are English.

Work in the assigned Git worktree and restrict edits to the assigned paths.
The coordinator integrates commits and runs the shared behavioral checks.
Do not push, create remotes, publish, or change sibling repositories.
User permits delegation to gpt-5.6-sol. Keep tasks concrete and bounded.

## Readable page authoring

The owner requires page recipes to be split into small, meaningful, documented
methods. main() describes the composition; helpers own coherent responsibilities
and have short docstrings. Do not flatten a page into one long method to reduce
line count. Prefer readability for a Python author reviewing LLM-generated code.
Keep actual sources available from each demo implementation, including any Pages
JavaScript/controller and adapter code needed to understand the full application.
