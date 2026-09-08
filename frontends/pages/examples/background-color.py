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
        root.data('color', '#223044')
        root.data('background', '#ffffff')

    def header(self, root):
        """Introduce the added behavior and invite inspection of Data."""
        root.h1('Background color')
        root.div('Choose the background color.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

    def controls(self, root):
        """Commit text on blur; update visual controls during interaction."""
        pane = root.div(class_="controls")
        pane.textBox(value="^text", lbl='Text', updateOn='blur')
        pane.colorpicker(value="^color", lbl='Text color', updateOn='input')
        pane.colorpicker(value="^background", lbl='Background color', updateOn='input')

    def preview(self, root):
        """Bind content and styles to the same state shown in Inspector."""
        root.textBox(value="^text", readonly=True, lbl="MyText", class_="demo-output", color='^color', background_color='^background')
