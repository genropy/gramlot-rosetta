// Compose the example with its own state, controls and output.
state(root);
header(root);
controls(root);
preview(root);

function state(root) {
    root.data("text", "Hello World");
    root.data("color", "#223044");
}

function header(root) {
    root.h1("Text color");
    root.div("Choose the text color.", {class: "description"});
    root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});
}

function controls(root) {
    const pane = root.div({class: "controls"});
    { const field = pane.html_label(); field.span("Text");
      field.input({"type": "text", "value": "^text", "updateOn": "blur"});
    }
    { const field = pane.html_label(); field.span("Text color");
      field.input({"type": "color", "value": "^color", "updateOn": "input"});
    }
}

function preview(root) {
    const output = root.div({class: "demo-output"});
    output.span("MyText: ");
    output.span("^text", {"color": "^color"});
}
