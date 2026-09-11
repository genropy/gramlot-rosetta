from gramlot.page import WebPage


class Page(WebPage):
    def main(self, root):
        contact = root.labledBox(datapath='contact', label='Contact details',
                                   class_='contact-box', label_position='TC')
        fields = contact.formlet(columns=2, class_='contact-fields')
        fields.textBox(value='^.first_name', lbl='First name')
        fields.textBox(value='^.last_name', lbl='Last name')
        fields.textBox(value='^.phone', lbl='Phone')
        fields.textBox(value='^.email', lbl='Email')
