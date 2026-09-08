from genro_pages.page import WebPage
from genro_pages.widget_test_builder import WidgetTestBuilder


class ExamplePage(WebPage):
    source_builder = WidgetTestBuilder

    def main(self, root):

        root.dataFormula(destination='sizeCss', formula="({size}) => size + 'px'", size="^size")

        root.h1('Font size')
        root.div('Adjust the font size.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

        pane = root.div(class_="controls")
        pane.textBox(value="^text", default='Hello World', lbl='Text', updateOn='blur')
        pane.colorpicker(value="^color", default='#223044', lbl='Text color', updateOn='input')
        pane.colorpicker(value="^background", default='#ffffff', lbl='Background color', updateOn='input')
        pane.horizontalSlider(value="^size", default=14, lbl="Font size", minimum=10, maximum=48,
                              step=1, intermediateChanges=True)

        root.textBox(value="^text", readonly=True, lbl="MyText", class_="demo-output", color='^color', background_color='^background', font_size='^sizeCss')
