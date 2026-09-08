// Compose the example with its own state, controls and output.
root.h1("Local scope");
root.div("Arrange text and style controls in two columns inside a labeled box.", {class: "description"});
root.p("Open Inspector → Data → sample. All controls and formulas use relative paths inside this branch.", {class: "hint"});
const sample = root.labledBox({datapath: "sample", label: "Text sample",
    box_border: "1px solid #c8c8c8", box_c_padding: "12px", class: "scoped-example"});
sample.dataFormula({destination: ".sizeCss", formula: ({size}) => size + 'px', size: "^.size"});
sample.dataFormula({destination: ".weight", formula: ({bold}) => bold ? 'bold' : 'normal', bold: "^.bold"});
sample.dataFormula({destination: ".slant", formula: ({italic}) => italic ? 'italic' : 'normal', italic: "^.italic"});
const pane = sample.formlet({columns: 2, gap: "12px", padding: "0", margin: "12px 0"});
pane.textBox({"value": "^.text", default: "Hello World", "lbl": "Text", grid_column: "1 / -1", "updateOn": "blur"});
pane.colorpicker({"value": "^.color", default: "#223044", "lbl": "Text color", "updateOn": "input"});
pane.colorpicker({"value": "^.background", default: "#ffffff", "lbl": "Background color", "updateOn": "input"});
pane.horizontalSlider({value: "^.size", default: 14, lbl: "Font size", minimum: 10, maximum: 48,
    step: 1, intermediateChanges: true});
pane.filteringSelect({"value": "^.font", default: "system-ui", "lbl": "Font family", "updateOn": "change", "values": "system-ui,serif,monospace"});
pane.checkbox({"value": "^.bold", default: false, "lbl": "Bold", "updateOn": "change"});
pane.checkbox({"value": "^.italic", default: false, "lbl": "Italic", "updateOn": "change"});
sample.textBox({value: "^.text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^.color", "background_color": "^.background", "font_size": "^.sizeCss", "font_family": "^.font", "font_weight": "^.weight", "font_style": "^.slant"});
