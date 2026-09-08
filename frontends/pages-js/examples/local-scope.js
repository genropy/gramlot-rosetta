// Compose the example with its own state, controls and output.
header(root);
const sample = root.box({datapath: "sample", lbl: "Text sample", lbl_position: "TL",
    box_border: "1px solid #c8c8c8", box_padding: "12px", class: "scoped-example"});
state(sample);
controls(sample);
preview(sample);

function state(root) {
    root.data(".text", "Hello World");
    root.data(".color", "#223044");
    root.data(".background", "#ffffff");
    root.data(".size", 14);
    root.data(".font", "system-ui");
    root.data(".bold", false);
    root.data(".italic", false);
    root.dataFormula({destination: ".sizeCss", func: ({size}) => size + 'px', size: "^.size"});
    root.dataFormula({destination: ".weight", func: ({bold}) => bold ? 'bold' : 'normal', bold: "^.bold"});
    root.dataFormula({destination: ".slant", func: ({italic}) => italic ? 'italic' : 'normal', italic: "^.italic"});
}

function header(root) {
    root.h1("Local scope");
    root.div("Keep text and style together in a compact, titled box.", {class: "description"});
    root.p("Open Inspector → Data → sample. All controls and formulas use relative paths inside this branch.", {class: "hint"});
}

function controls(root) {
    const pane = root.div({class: "controls compact-controls"});
    pane.textBox({"value": "^.text", "lbl": "Text", "updateOn": "blur"});
    pane.colorpicker({"value": "^.color", "lbl": "Text color", "updateOn": "input"});
    pane.colorpicker({"value": "^.background", "lbl": "Background color", "updateOn": "input"});
    pane.horizontalSlider({value: "^.size", lbl: "Font size", minimum: 10, maximum: 48,
        step: 1, intermediateChanges: true});
    pane.filteringSelect({"value": "^.font", "lbl": "Font family", "updateOn": "change", "values": "system-ui,serif,monospace"});
    pane.checkbox({"value": "^.bold", "lbl": "Bold", "updateOn": "change"});
    pane.checkbox({"value": "^.italic", "lbl": "Italic", "updateOn": "change"});
}

function preview(root) {
    root.textBox({value: "^.text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^.color", "background_color": "^.background", "font_size": "^.sizeCss", "font_family": "^.font", "font_weight": "^.weight", "font_style": "^.slant"});
}
