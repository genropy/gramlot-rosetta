from gramlot.page import WebPage


class Page(WebPage):
    def main(self, root):
        root.h1('Hello World')
