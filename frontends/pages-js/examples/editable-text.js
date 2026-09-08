// Compose the example with its own state, controls and output.
state(root);
header(root);
controls(root);
preview(root);

function state(root) {
    root.data("text", "Hello World");
}

function header(root) {
    root.h1("Editable text");
    root.div("Edit the greeting text.", {class: "description"});
    root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});
}

function controls(root) {
    const pane = root.div({class: "controls"});
    { const field = pane.html_label(); field.span("Text");
      field.input({"type": "text", "value": "^text", "updateOn": "blur"});
    }
}

function preview(root) {
    const output = root.div({class: "demo-output"});
    output.span("MyText: ");
    output.span("^text", {});
}
