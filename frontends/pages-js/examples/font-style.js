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
    root.data("font", "system-ui");
    root.data("bold", false);
    root.data("italic", false);
    root.dataFormula({destination: "sizeCss", func: ({size}) => size + 'px', size: "^size"});
    root.dataFormula({destination: "weight", func: ({bold}) => bold ? 'bold' : 'normal', bold: "^bold"});
    root.dataFormula({destination: "slant", func: ({italic}) => italic ? 'italic' : 'normal', italic: "^italic"});
}

function header(root) {
    root.h1("Font style");
    root.div("Toggle bold and italic styles.", {class: "description"});
    root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});
}

function controls(root) {
    const pane = root.div({class: "controls"});
    pane.textBox({"value": "^text", "lbl": "Text", "updateOn": "blur"});
    pane.colorpicker({"value": "^color", "lbl": "Text color", "updateOn": "input"});
    pane.colorpicker({"value": "^background", "lbl": "Background color", "updateOn": "input"});
    pane.horizontalSlider({value: "^size", lbl: "Font size", minimum: 10, maximum: 48,
        step: 1, intermediateChanges: true});
    pane.filteringSelect({"value": "^font", "lbl": "Font family", "updateOn": "change", "values": "system-ui,serif,monospace"});
    pane.checkbox({"value": "^bold", "lbl": "Bold", "updateOn": "change"});
    pane.checkbox({"value": "^italic", "lbl": "Italic", "updateOn": "change"});
}

function preview(root) {
    root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^color", "background_color": "^background", "font_size": "^sizeCss", "font_family": "^font", "font_weight": "^weight", "font_style": "^slant"});
}
