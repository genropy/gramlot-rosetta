from genro_pages.page import WebPage
from genro_pages.widget_test_builder import WidgetTestBuilder


class ExamplePage(WebPage):
    source_builder = WidgetTestBuilder

    def main(self, root):

        root.dataFormula(destination='sizeCss', formula="({size}) => size + 'px'", size="^size")
        root.dataFormula(destination='weight', formula="({bold}) => bold ? 'bold' : 'normal'", bold="^bold")
        root.dataFormula(destination='slant', formula="({italic}) => italic ? 'italic' : 'normal'", italic="^italic")

        root.h1('Font style')
        root.div('Toggle bold and italic styles.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

        pane = root.div(class_="controls")
        pane.textBox(value="^text", default='Hello World', lbl='Text', updateOn='blur')
        pane.colorpicker(value="^color", default='#223044', lbl='Text color', updateOn='input')
        pane.colorpicker(value="^background", default='#ffffff', lbl='Background color', updateOn='input')
        pane.horizontalSlider(value="^size", default=14, lbl="Font size", minimum=10, maximum=48,
                              step=1, intermediateChanges=True)
        pane.filteringSelect(value="^font", default='system-ui', lbl='Font family', updateOn='change', values="system-ui,serif,monospace")
        pane.checkbox(value="^bold", default=False, lbl='Bold', updateOn='change')
        pane.checkbox(value="^italic", default=False, lbl='Italic', updateOn='change')

        root.textBox(value="^text", readonly=True, lbl="MyText", class_="demo-output", color='^color', background_color='^background', font_size='^sizeCss', font_family='^font', font_weight='^weight', font_style='^slant')
