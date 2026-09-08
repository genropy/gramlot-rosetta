// Show a static greeting; later examples will make its text editable.
root.h1('Hello World');
root.div('Display a fixed text. Later examples will let you change it.', {class: 'description'});
root.textBox({value: 'Hello World', readonly: true, lbl: 'MyText', class: 'demo-output'});
