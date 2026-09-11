from gramlot.page import WebPage


class Page(WebPage):
    title = "Beta"

    def main(self, root):
        root.h1('Beta page')
