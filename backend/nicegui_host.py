"""Register NiceGUI on the same FastAPI server, in its own URL namespace."""
from nicegui import ui

from frontends.nicegui.page import hello_world
from frontends.nicegui.data_binding import data_binding
from frontends.nicegui.input_widgets import input_widgets
from frontends.nicegui.contact_box import contact_box
from frontends.nicegui.repeated_contacts import repeated_contacts
from frontends.nicegui.contact_colors import contact_colors


def mount_nicegui(app):
    ui.page('/hello-world/')(hello_world)
    ui.page('/data-binding/')(data_binding)
    ui.page('/input-widgets/')(input_widgets)
    ui.page('/contact-box/')(contact_box)
    ui.page('/repeated-contacts/')(repeated_contacts)
    ui.page('/contact-colors/')(contact_colors)
    ui.add_head_html('<link rel="stylesheet" href="/shared/example.css">', shared=True)
    ui.run_with(app, mount_path='/examples/nicegui', title='Hello World · NiceGUI',
                show_welcome_message=False)
