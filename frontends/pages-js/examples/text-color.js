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
    pane.textBox({"value": "^text", "lbl": "Text", "updateOn": "blur"});
    pane.colorpicker({"value": "^color", "lbl": "Text color", "updateOn": "input"});
}

function preview(root) {
    root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^color"});
}
