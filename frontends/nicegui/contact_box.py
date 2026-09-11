from nicegui import ui


def contact_box():
    contact = {}
    with ui.element('section').classes('contact-box').props('aria-label="Contact details"'):
        ui.html('Contact details', tag='h2')
        with ui.element('div').classes('input-fields'):
            ui.input('First name').on('blur', lambda event: contact.update(first_name=event.sender.value))
            ui.input('Last name').on('blur', lambda event: contact.update(last_name=event.sender.value))
            ui.input('Phone').on('blur', lambda event: contact.update(phone=event.sender.value))
            ui.input('Email').on('blur', lambda event: contact.update(email=event.sender.value))
