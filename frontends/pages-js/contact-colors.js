const cards = root.formlet({col_min_width: '250px', class: 'contact-cards'});
for (let index = 1; index <= 6; index++) {
    contactBox(cards, index);
}

/** Build a contact card with its own background color. */
function contactBox(parent, index) {
    parent.data(`c${index}.color`, '#29384d');
    const contact = parent.labledBox({datapath: `c${index}`, label: `Contact ${index}`,
        class: 'contact-box', label_position: 'TC', label_background: '^.color'});
    const fields = contact.formlet({columns: 2, class: 'contact-fields'});
    fields.textBox({value: '^.first_name', lbl: 'First name'});
    fields.textBox({value: '^.last_name', lbl: 'Last name'});
    fields.textBox({value: '^.phone', lbl: 'Phone'});
    fields.textBox({value: '^.email', lbl: 'Email'});
    fields.colorpicker({value: '^.color', lbl: 'Title background', live: true});
}
