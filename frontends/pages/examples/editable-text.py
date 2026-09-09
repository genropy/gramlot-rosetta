from gramlot.builder import GramlotBuilder
from gramlot.page import WebPage


class ExamplePage(WebPage):
    source_builder = GramlotBuilder

    def main(self, root):


        root.h1('Editable text')
        root.div('Edit the greeting text.', class_="description")
        root.p("Open Inspector → Data. Change a control and observe its value and the output.", class_="hint")

        pane = root.div(class_="controls")
        pane.textBox(value="^text", default='Hello World', lbl='Text', updateOn='blur')

        root.textBox(value="^text", readonly=True, lbl="MyText", class_="demo-output")
