const contact = root.labledBox({datapath: 'contact', label: 'Contact details',
    class: 'contact-box', label_position: 'TC'});
const fields = contact.formlet({columns: 2, class: 'contact-fields'});
fields.textBox({value: '^.first_name', lbl: 'First name'});
fields.textBox({value: '^.last_name', lbl: 'Last name'});
fields.textBox({value: '^.phone', lbl: 'Phone'});
fields.textBox({value: '^.email', lbl: 'Email'});
