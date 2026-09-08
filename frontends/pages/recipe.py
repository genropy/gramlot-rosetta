"""The application contains only the Hello World example."""
from genro_builders.contrib.html.html_builder import HtmlBuilder
from genro_pages.page import WebPage


class HelloWorldPage(WebPage):
    """Describe the same static page as the React and Vue examples."""

    source_builder = HtmlBuilder

    def main(self, root):
        """Show a title and a plain text greeting."""
        root.h1("Hello World")
        root.div("Hello World")
