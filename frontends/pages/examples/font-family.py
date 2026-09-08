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
        root.data('size', 14)
        root.data('font', 'system-ui')
        root.dataFormula(destination='sizeCss', func="({size}) => size + 'px'", size="^size")

    def header(self, root):
        """Introduce the added behavior and invite inspection of Data."""
        root.h1('Font family')
        root.div('Choose the font family.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

    def controls(self, root):
        """Commit text on blur; update visual controls during interaction."""
        pane = root.div(class_="controls")
        field = pane.html_label()
        field.span('Text')
        field.input(type='text', value='^text', updateOn='blur')
        field = pane.html_label()
        field.span('Text color')
        field.input(type='color', value='^color', updateOn='input')
        field = pane.html_label()
        field.span('Background color')
        field.input(type='color', value='^background', updateOn='input')
        field = pane.html_label()
        field.span('Font size')
        field.input(type='range', value='^size', updateOn='input', min=10, max=48, step=1)
        field = pane.html_label()
        field.span('Font family')
        select = field.select(value="^font", updateOn="change", **{"aria-label": "Font family"})
        for font in ("system-ui", "serif", "monospace"):
            select.option(font, value=font)

    def preview(self, root):
        """Bind content and styles to the same state shown in Inspector."""
        output = root.div(class_="demo-output")
        output.span("MyText: ")
        output.span("^text", color='^color', background_color='^background', font_size='^sizeCss', font_family='^font')
