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
    root.dataFormula({destination: "sizeCss", func: ({size}) => size + 'px', size: "^size"});
}

function header(root) {
    root.h1("Font family");
    root.div("Choose the font family.", {class: "description"});
    root.p("Open Inspector → Data. Change a control and observe its value and the output.", {class: "hint"});
}

function controls(root) {
    const pane = root.div({class: "controls"});
    { const field = pane.html_label(); field.span("Text");
      field.input({"type": "text", "value": "^text", "updateOn": "blur"});
    }
    { const field = pane.html_label(); field.span("Text color");
      field.input({"type": "color", "value": "^color", "updateOn": "input"});
    }
    { const field = pane.html_label(); field.span("Background color");
      field.input({"type": "color", "value": "^background", "updateOn": "input"});
    }
    { const field = pane.html_label(); field.span("Font size");
      field.input({"type": "range", "value": "^size", "updateOn": "input", "min": 10, "max": 48, "step": 1});
    }
    { const field = pane.html_label(); field.span("Font family");
      const select = field.select({value: "^font", updateOn: "change"});
      for (const font of ["system-ui", "serif", "monospace"]) select.option(font, {value: font});
    }
}

function preview(root) {
    const output = root.div({class: "demo-output"});
    output.span("MyText: ");
    output.span("^text", {"color": "^color", "background_color": "^background", "font_size": "^sizeCss", "font_family": "^font"});
}
