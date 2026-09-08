// Compose the example with its own state, controls and output.
state(root);
header(root);
controls(root);
preview(root);

function state(root) {
    root.data("text", "Hello World");
    root.data("color", "#223044");
    root.data("background", "#ffffff");
}

function header(root) {
    root.h1("Background color");
    root.div("Choose the background color.", {class: "description"});
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
    { const field = pane.html_label(); field.span("Background color");
      field.input({"type": "color", "value": "^background", "updateOn": "input"});
    }
}

function preview(root) {
    const output = root.div({class: "demo-output"});
    output.span("MyText: ");
    output.span("^text", {"color": "^color", "background_color": "^background"});
}
