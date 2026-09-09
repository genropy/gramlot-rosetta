from gramlot.builder import GramlotBuilder
from gramlot.page import WebPage


class HelloWorldPage(WebPage):
    source_builder = GramlotBuilder

    def main(self, root):
        """Show a static greeting; later examples will make its text editable."""
        root.h1("Hello World")
        root.div("Display a fixed text. Later examples will let you change it.", class_="description")
        root.textBox(value="Hello World", readonly=True, lbl="MyText", class_="demo-output")
