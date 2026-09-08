from genro_pages.page import WebPage
from genro_pages.widget_test_builder import WidgetTestBuilder


class HelloWorldPage(WebPage):
    source_builder = WidgetTestBuilder

    def main(self, root):
        """Show a static greeting; later examples will make its text editable."""
        root.h1("Hello World")
        root.div("Display a fixed text. Later examples will let you change it.", class_="description")
        root.textBox(value="Hello World", readonly=True, lbl="MyText", class_="demo-output")
