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
    pane.textBox({"value": "^text", "lbl": "Text", "updateOn": "blur"});
    pane.colorpicker({"value": "^color", "lbl": "Text color", "updateOn": "input"});
    pane.colorpicker({"value": "^background", "lbl": "Background color", "updateOn": "input"});
}

function preview(root) {
    root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^color", "background_color": "^background"});
}
