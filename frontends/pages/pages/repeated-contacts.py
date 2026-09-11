from gramlot.page import WebPage


class Page(WebPage):
    def main(self, root):
        cards = root.formlet(col_min_width='250px', class_='contact-cards')
        for index in range(1, 7):
            self.contact_box(cards, index)

    def contact_box(self, parent, index):
        """Build one contact card with its own Data branch."""
        contact = parent.labledBox(datapath=f'c{index}', label=f'Contact {index}',
                                   class_='contact-box', label_position='TC')
        fields = contact.formlet(columns=2, class_='contact-fields')
        fields.textBox(value='^.first_name', lbl='First name')
        fields.textBox(value='^.last_name', lbl='Last name')
        fields.textBox(value='^.phone', lbl='Phone')
        fields.textBox(value='^.email', lbl='Email')
