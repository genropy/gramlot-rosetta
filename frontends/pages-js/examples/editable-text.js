

root.h1("Editable text");
root.div("Edit the greeting text.", {class: "description"});
root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});

const pane = root.div({class: "controls"});
pane.textBox({"value": "^text", default: "Hello World", "lbl": "Text", "updateOn": "blur"});

root.textBox({value: "^text", readonly: true, lbl: "MyText", class: "demo-output"});
