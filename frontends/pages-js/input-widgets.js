const fields = root.formlet({columns: 2});
fields.textBox({value: '^name', lbl: 'Name'});
fields.numberTextBox({value: '^quantity', lbl: 'Quantity'});
fields.dateTextBox({value: '^date', lbl: 'Date'});
fields.timeTextBox({value: '^time', lbl: 'Time'});
fields.checkbox({checked: '^updates', lbl: 'Updates'});
fields.textBoxArea({value: '^notes', lbl: 'Notes', rows: 3});
