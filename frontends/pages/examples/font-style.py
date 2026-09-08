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
        root.data('bold', False)
        root.data('italic', False)
        root.dataFormula(destination='sizeCss', func="({size}) => size + 'px'", size="^size")
        root.dataFormula(destination='weight', func="({bold}) => bold ? 'bold' : 'normal'", bold="^bold")
        root.dataFormula(destination='slant', func="({italic}) => italic ? 'italic' : 'normal'", italic="^italic")

    def header(self, root):
        """Introduce the added behavior and invite inspection of Data."""
        root.h1('Font style')
        root.div('Toggle bold and italic styles.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

    def controls(self, root):
        """Commit text on blur; update visual controls during interaction."""
        pane = root.div(class_="controls")
        pane.textBox(value="^text", lbl='Text', updateOn='blur')
        pane.colorpicker(value="^color", lbl='Text color', updateOn='input')
        pane.colorpicker(value="^background", lbl='Background color', updateOn='input')
        field = pane.html_label()
        field.span("Font size")
        field.input(type="range", value="^size", updateOn="input", min=10, max=48, step=1)
        pane.filteringSelect(value="^font", lbl='Font family', updateOn='change', values="system-ui,serif,monospace")
        pane.checkbox(value="^bold", lbl='Bold', updateOn='change')
        pane.checkbox(value="^italic", lbl='Italic', updateOn='change')

    def preview(self, root):
        """Bind content and styles to the same state shown in Inspector."""
        root.textBox(value="^text", readonly=True, lbl="MyText", class_="demo-output", color='^color', background_color='^background', font_size='^sizeCss', font_family='^font', font_weight='^weight', font_style='^slant')
