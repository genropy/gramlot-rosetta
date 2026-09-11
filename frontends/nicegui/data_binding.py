from html import escape

from nicegui import ui


def data_binding():
    data = {'live_message': 'Hello World', 'message': 'Hello World'}
    ui.html(tag='h1').bind_content_from(data, 'live_message', backward=escape)
    ui.input('Live', value=data['live_message']).bind_value(data, 'live_message')
    ui.html(tag='h1').bind_content_from(data, 'message', backward=escape)
    ui.input('On focus out', value=data['message']).on(
        'blur', lambda event: data.update(message=event.sender.value))
