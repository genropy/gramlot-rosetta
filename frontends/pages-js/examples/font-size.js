

root.dataFormula({destination: "sizeCss", formula: ({size}) => size + 'px', size: "^size"});

root.h1("Font size");
root.div("Adjust the font size.", {class: "description"});
root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});

const pane = root.div({class: "controls"});
pane.textBox({"value": "^text", default: "Hello World", "lbl": "Text", "updateOn": "blur"});
pane.colorpicker({"value": "^color", default: "#223044", "lbl": "Text color", "updateOn": "input"});
pane.colorpicker({"value": "^background", default: "#ffffff", "lbl": "Background color", "updateOn": "input"});
pane.horizontalSlider({value: "^size", default: 14, lbl: "Font size", minimum: 10, maximum: 48,
    step: 1, intermediateChanges: true});

root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^color", "background_color": "^background", "font_size": "^sizeCss"});
