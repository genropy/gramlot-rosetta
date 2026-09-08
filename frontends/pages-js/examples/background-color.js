

root.h1("Background color");
root.div("Choose the background color.", {class: "description"});
root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});

const pane = root.div({class: "controls"});
pane.textBox({"value": "^text", default: "Hello World", "lbl": "Text", "updateOn": "blur"});
pane.colorpicker({"value": "^color", default: "#223044", "lbl": "Text color", "updateOn": "input"});
pane.colorpicker({"value": "^background", default: "#ffffff", "lbl": "Background color", "updateOn": "input"});

root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output", "color": "^color", "background_color": "^background"});
