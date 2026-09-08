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
    { const field = pane.html_label(); field.span("Bold");
      field.input({"type": "checkbox", "value": "^bold", "updateOn": "change"});
    }
    { const field = pane.html_label(); field.span("Italic");
      field.input({"type": "checkbox", "value": "^italic", "updateOn": "change"});
    }
}

function preview(root) {
    const output = root.div({class: "demo-output"});
    output.span("MyText: ");
    output.span("^text", {"color": "^color", "background_color": "^background", "font_size": "^sizeCss", "font_family": "^font", "font_weight": "^weight", "font_style": "^slant"});
}
