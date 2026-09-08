"""Python-authored source recipe for the Genro Pages comparison."""
from genro_pages.page import WebPage
from genro_pages.widget_test_builder import WidgetTestBuilder


class OrdersPage(WebPage):
    """Build the complete order editor interface as a Genro source recipe."""

    source_builder = WidgetTestBuilder

    def main(self, root):
        root.data("order.pending", True)
        root.data("order.feedback", "Loading orders…")
        root.data("order.selected.id", 0)
        root.data("order.selected.customer", "")
        root.data("order.selected.product", "")
        root.data("order.selected.quantity", 0)
        root.data("order.selected.unit_price_cents", 0)
        root.data("order.selected.note", "")
        root.data("order.selected.fulfilled", False)

        app = root.div(class_="app")
        navigation = app.nav(**{"aria-label": "Implementations"})
        navigation.a("React", href="/react/")
        navigation.a("Vue", href="/vue/")
        navigation.a("Genro Pages", href="/pages/", **{"aria-current": "page"})
        app.h1("Order editor · Genro Pages")
        app.p(
            "Changes commit on blur. Selecting another order discards unsaved edits; "
            "Reset demo restores all seed orders.",
            class_="hint",
        )

        layout = app.div(class_="layout")
        orders = layout.section(class_="panel", **{"aria-labelledby": "orders-heading"})
        orders.h2("Orders", id="orders-heading")
        order_list = orders.div(class_="order-list", node_id="order_list")
        order_list.span("Loading orders…", hidden=True)

        editor = layout.section(
            class_="panel", datapath="order", **{"aria-labelledby": "editor-heading"}
        )
        editor.h2("Selected order", id="editor-heading")
        form = editor.div()
        form.p("Product: ").span("^.selected.product", **{"data-testid": "product"})
        form.p("Unit price: ").span(
            "^.selected.unit_price", **{"data-testid": "unit-price"}
        )
        form.textBox(
            value="^.selected.customer", lbl="Customer", disabled="^.pending",
            width="100%", **{"data-testid": "customer"},
        )
        form.numberTextBox(
            value="^.selected.quantity", lbl="Quantity", disabled="^.pending",
            width="100%", **{"data-testid": "quantity"},
        )
        form.textBox(
            value="^.selected.note", lbl="Note", disabled="^.pending",
            width="100%", **{"data-testid": "note"},
        )
        form.checkbox(
            checked="^.selected.fulfilled", label="Fulfilled", disabled="^.pending",
            **{"data-testid": "fulfilled"},
        )
        form.dataFormula(
            destination=".selected.total",
            func=(
                "({quantity, unitPrice}) => "
                "`EUR ${(Number(quantity || 0) * Number(unitPrice || 0) / 100).toFixed(2)}`"
            ),
            quantity="^.selected.quantity",
            unitPrice="^.selected.unit_price_cents",
            _on_start=True,
        )
        form.p("^.selected.total", class_="total", **{"data-testid": "total"})
        actions = form.div(class_="actions")
        actions.button(
            "Save", class_="primary", disabled="^.pending",
            action="genro.controller.save();", **{"data-testid": "save"},
        )
        actions.button(
            "Reset demo", disabled="^.pending",
            action="genro.controller.reset();", **{"data-testid": "reset"},
        )
        form.p(
            "^.feedback", class_="feedback", role="status", **{"data-testid": "feedback"}
        )
