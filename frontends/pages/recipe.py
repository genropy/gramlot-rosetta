from genro_builders.contrib.html.html_builder import HtmlBuilder
from genro_pages.page import WebPage


class HelloWorldPage(WebPage):
    source_builder = HtmlBuilder

    def main(self, root):
        """Show a static greeting; later examples will make its text editable."""
        root.h1("Hello World")
        root.div("Display a fixed text. Later examples will let you change it.", class_="description")
        root.div("MyText: Hello World")
