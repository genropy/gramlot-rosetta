from gramlot.builder import GramlotBuilder
from gramlot.page import WebPage


class ExamplePage(WebPage):
    source_builder = GramlotBuilder

    def main(self, root):

        root.h1('Text color')
        root.div('Choose the text color.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

        pane = root.div(class_="controls")
        pane.textBox(value="^text", default='Hello World', lbl='Text', updateOn='blur')
        pane.colorpicker(value="^color", default='#223044', lbl='Text color', updateOn='input')

        root.textBox(value="^text", readonly=True, lbl="MyText", class_="demo-output", color='^color')
