# Visual Source builder PoC

Open `/builder/` (also linked from Overview). The tool uses the installed Gramlot
runtime and mutates the mounted application's Source Bag inside live batches.
It does not evaluate newly generated code or rebuild the application per edit.

Drag catalogue items onto the preview or Source tree. Green borders identify
containers accepting the current payload; red borders identify leaves and
self/descendant targets. Drops append children. Select a node to use the Move
handle, sibling Up/Down actions, Delete and the attribute editor. Add buttons
provide a non-drag insertion option. Initial text and input share reactive Data.
The inspector provides the Source view; there is no duplicate JSON panel below the canvas.
The playground-only data-design-id attribute is hidden in the property editors.

The bounded catalogue has div, formlet and labledBox containers; h2, p, button,
textBox, numberTextBox, checkbox and colorpicker leaves. Acceptance is explicitly
restricted to these rules; it is not a complete component-grammar validator.
The right sidebar embeds the real Gramlot inspector, initially on Source.
Its typed property rows commit when focus leaves a row, with no recipe Run step.
Relative bindings need a valid scope. The Data tab remains available.
Source-tree drag and drop is a page-local adapter: ordinary inspectors and the
Data tree do not become draggable. Selection in the preview selects Source properties.

Moves preserve the effective Data scope by setting an explicit datapath where
one was inherited. Reparenting removes and reinserts the Source node in one batch;
it is not a promise to retain focus/caret or DOM identity for the moved subtree.
Existing Data remains live. Delete removes Source only, retaining Data.

This is an ephemeral experiment: no save/import, undo history, code generation,
slot-specific acceptance or drag directly from arbitrary preview content. Use the
selected Move handle or drag a Source-tree row. Reload resets the experiment.

Hover a preview block to reveal its pencil. Clicking opens a compact parameter
dialog using the same InspectorEditor and Source Bag as the sidebar. Row focus-out
commits edits immediately; the close button and Escape dismiss the dialog.
The selected block’s Edit attributes action opens the same dialog without hovering.
