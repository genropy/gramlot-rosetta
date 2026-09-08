// Compose the example with its own state, controls and output.
state(root);
header(root);
controls(root);
preview(root);

function state(root) {
    root.data("text", "Hello World");
    root.data("color", "#223044");
    root.data("background", "#ffffff");
    root.data("size", 14);
    root.dataFormula({destination: "sizeCss", func: ({size}) => size + 'px', size: "^size"});
}

function header(root) {
    root.h1("Font size");
    root.div("Adjust the font size.", {class: "description"});
    root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});
}

function controls(root) {
    const pane = root.div({class: "controls"});
    pane.textBox({"value": "^text", "lbl": "Text", "updateOn": "blur"});
    pane.colorpicker({"value": "^color", "lbl": "Text color", "updateOn": "input"});
    pane.colorpicker({"value": "^background", "lbl": "Background color", "updateOn": "input"});
    const field = pane.html_label();
    field.span("Font size");
    field.input({type: "range", value: "^size", updateOn: "input", min: 10, max: 48, step: 1});
}

function preview(root) {
    root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^color", "background_color": "^background", "font_size": "^sizeCss"});
}
