// Compose the example with its own state, controls and output.
root.h1("Repeated panels");
root.div("Repeat the same panel six times with independent values.", {class: "description"});
root.p("Open Inspector → Data: common.position moves every label; panels holds the independent text and style values.", {class: "hint"});
const settings = root.labledBox({label: "Common settings", box_border: "1px solid #c8c8c8",
    box_c_padding: "12px", class: "common-settings"});
settings.filteringSelect({value: "^common.position", default: "TL", lbl: "Label position", lbl_position: "^common.position",
    values: "L,R,TL,TC,TR,BL,BC,BR", updateOn: "change"});
for (let index = 0; index < 6; index++) {
    textPanel(root, `panels.panel_${index}`, `Text sample ${index + 1}`);
}

// Reuse the same panel under a distinct data branch.
function textPanel(root, datapath, title) {
    const sample = root.labledBox({datapath, label: title, lbl_position: "^common.position",
        box_border: "1px solid #c8c8c8", box_c_padding: "12px", class: "scoped-example"});
    sample.dataFormula({destination: ".sizeCss", formula: ({size}) => size + 'px', size: "^.size"});
    sample.dataFormula({destination: ".weight", formula: ({bold}) => bold ? 'bold' : 'normal', bold: "^.bold"});
    sample.dataFormula({destination: ".slant", formula: ({italic}) => italic ? 'italic' : 'normal', italic: "^.italic"});
    const pane = sample.formlet({columns: 2, gap: "12px", padding: "0", margin: "12px 0"});
    pane.textBox({"value": "^.text", default: "Hello World", "lbl": "Text", lbl_position: "^common.position", grid_column: "1 / -1", "updateOn": "blur"});
    pane.colorpicker({"value": "^.color", default: "#223044", "lbl": "Text color", lbl_position: "^common.position", "updateOn": "input"});
    pane.colorpicker({"value": "^.background", default: "#ffffff", "lbl": "Background color", lbl_position: "^common.position", "updateOn": "input"});
    pane.horizontalSlider({value: "^.size", default: 14, lbl: "Font size", lbl_position: "^common.position", minimum: 10, maximum: 48,
        step: 1, intermediateChanges: true});
    pane.filteringSelect({"value": "^.font", default: "system-ui", "lbl": "Font family", lbl_position: "^common.position", "updateOn": "change", "values": "system-ui,serif,monospace"});
    pane.checkbox({"value": "^.bold", default: false, "lbl": "Bold", lbl_position: "^common.position", "updateOn": "change"});
    pane.checkbox({"value": "^.italic", default: false, "lbl": "Italic", lbl_position: "^common.position", "updateOn": "change"});
    sample.textBox({value: "^.text", readonly: true, lbl: "MyText", lbl_position: "^common.position", class: "demo-output", "color": "^.color", "background_color": "^.background", "font_size": "^.sizeCss", "font_family": "^.font", "font_weight": "^.weight", "font_style": "^.slant"});
}
