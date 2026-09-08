# Rosetta specification — Hello World baseline

The comparison frame is ordinary HTML shared by React, Vue and Genro Pages.
It owns implementation navigation, example selection and View source. Each
framework renders only the selected application inside an independent iframe.
The frame has no JavaScript framework or script of its own.

## Active example: Hello World

Each version contains a heading with the literal text "Hello World" and a div
with the literal text "Hello World". No input, dynamic style, order UI or business
API calls belong to this first example. A small shared CSS file supplies the same
basic text appearance to each isolated document.

The existing /react/, /vue/ and /pages/ URLs display the common frame. Example
URLs are /examples/{variant}/hello-world/. View source opens a separate tab showing
the actual individual recipe/component first. Bootstrap, host adapter and common
HTML frame are separately inspectable and measured as infrastructure.

Python recipes with meaningful complexity use documented composition methods.
This two-statement example needs no artificial helper hierarchy.

## Standby

Orders is removed from active navigation, routes and tests. Its authored files,
previous specification and tests are preserved under standby/orders from the
working f3ad84f baseline. Reintroduce it only when requested, as a separate example
inside the same HTML frame, stripping its previous comparison navigation.

## Later agreed directions, not part of this baseline

Reactive greeting input; then slider, text/background colors and font selection
using existing components. A minimal genro-asgi host should eventually run the
same frontend examples. The intended FastAPI adapter should ship with Pages;
this consumer demo does not establish that packaging yet. See docs/EVOLUTION.md.

The shared HTML frame always displays the selected implementation's source in a
second iframe: alongside the example on wide screens and below it on narrower
screens. Source navigation stays within that pane and does not replace the live
example. The standalone source link remains available. No frontend-specific code
or parent JavaScript is required for this layout.

Source inspection opens on the Page tab and displays only the selected page's
application file (recipe.py for Pages). Boilerplate contains framework-specific
startup and integration files. Common contains files shared by all three
implementations, never mixed into the page or boilerplate file lists. Tabs are
plain HTML links; the embedded viewer does not repeat framework navigation.
