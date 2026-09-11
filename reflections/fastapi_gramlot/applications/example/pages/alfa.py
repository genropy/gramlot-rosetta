from gramlot.page import WebPage


class Page(WebPage):
    title = "Alfa"

    def main(self, root):
        root.h1('Alfa page')
