from nicegui import ui


def contact_colors():
    contacts = {f'c{index}': {'color': '#29384d'} for index in range(1, 7)}
    with ui.element('div').classes('contact-cards'):
        for index in range(1, 7):
            contact = contacts[f'c{index}']
            with ui.element('section').classes('contact-box').props(f'aria-label="Contact {index}"'):
                title = ui.html(f'Contact {index}', tag='h2').style('background:#29384d')
                with ui.element('div').classes('input-fields'):
                    ui.input('First name').on('blur', lambda event, contact=contact: contact.update(first_name=event.sender.value))
                    ui.input('Last name').on('blur', lambda event, contact=contact: contact.update(last_name=event.sender.value))
                    ui.input('Phone').on('blur', lambda event, contact=contact: contact.update(phone=event.sender.value))
                    ui.input('Email').on('blur', lambda event, contact=contact: contact.update(email=event.sender.value))
                    ui.input('Title background', value=contact['color']).props('type=color').on_value_change(
                        lambda event, contact=contact, title=title: (
                            contact.update(color=event.value),
                            title.style(f'background:{event.value}')))
