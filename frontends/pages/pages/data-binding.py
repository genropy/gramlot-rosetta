from gramlot.page import WebPage


class Page(WebPage):
    def main(self, root):
        root.data('live_message', 'Hello World')
        root.h1('^live_message')
        root.textBox(value='^live_message', lbl='Live', live=True)
        root.data('message', 'Hello World')
        root.h1('^message')
        root.textBox(value='^message', lbl='On focus out')
