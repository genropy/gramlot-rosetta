from gramlot.page import WebPage


class Page(WebPage):
    title = "Hello"

    def main(self, root):
        root.h1('Hello World')
