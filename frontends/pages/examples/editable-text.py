from genro_pages.page import WebPage
from genro_pages.widget_test_builder import WidgetTestBuilder


class ExamplePage(WebPage):
    source_builder = WidgetTestBuilder

    def main(self, root):
        """Compose the example with its own state, controls and output."""
        self.state(root)
        self.header(root)
        self.controls(root)
        self.preview(root)

    def state(self, root):
        """Declare the values observed by controls and output."""
        root.data('text', 'Hello World')

    def header(self, root):
        """Introduce the added behavior and invite inspection of Data."""
        root.h1('Editable text')
        root.div('Edit the greeting text.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

    def controls(self, root):
        """Commit text on blur; update visual controls during interaction."""
        pane = root.div(class_="controls")
        field = pane.html_label()
        field.span('Text')
        field.input(type='text', value='^text', updateOn='blur')

    def preview(self, root):
        """Bind content and styles to the same state shown in Inspector."""
        output = root.div(class_="demo-output")
        output.span("MyText: ")
        output.span("^text")
