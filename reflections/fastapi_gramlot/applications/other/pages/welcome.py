from gramlot.page import WebPage


class Page(WebPage):
    title = "Welcome"

    def main(self, root):
        root.h1('Another application')
