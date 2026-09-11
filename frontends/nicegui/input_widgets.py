from nicegui import ui


def input_widgets():
    data = {}
    with ui.element('div').classes('input-fields'):
        ui.input('Name').on('blur', lambda event: data.update(name=event.sender.value))
        ui.number('Quantity').on('blur', lambda event: data.update(quantity=event.sender.value))
        ui.input('Date').props('type=date').on('blur', lambda event: data.update(date=event.sender.value))
        ui.input('Time').props('type=time').on('blur', lambda event: data.update(time=event.sender.value))
        ui.checkbox('Updates').bind_value(data, 'updates')
        ui.textarea('Notes').props('rows=3 autogrow=false').on(
            'blur', lambda event: data.update(notes=event.sender.value))
