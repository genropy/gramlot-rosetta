"""Python-authored source recipe for the Genro Pages comparison."""
from genro_pages.page import WebPage
from genro_pages.widget_test_builder import WidgetTestBuilder


class OrdersPage(WebPage):
    """Build the complete order editor interface as a Genro source recipe."""

    source_builder = WidgetTestBuilder

    def main(self, root):
        """Assemble the order editor page."""
        self.initialize_data(root)

        app = root.div(class_="app")
        self.build_header(app)

        layout = app.div(class_="layout")
        self.build_order_list(layout)
        self.build_order_details(layout)

    def initialize_data(self, root):
        """Set the initial loading state and empty order draft."""
        root.data("order.pending", True)
        root.data("order.feedback", "Loading orders…")
        root.data("order.selected.id", 0)
        root.data("order.selected.customer", "")
        root.data("order.selected.product", "")
        root.data("order.selected.quantity", 0)
        root.data("order.selected.unit_price_cents", 0)
        root.data("order.selected.note", "")
        root.data("order.selected.fulfilled", False)

    def build_header(self, app):
        """Provide implementation navigation and editing guidance."""
        navigation = app.nav(**{"aria-label": "Implementations"})
        navigation.a("React", href="/react/")
        navigation.a("Vue", href="/vue/")
        navigation.a("Genro Pages", href="/pages/", **{"aria-current": "page"})
        navigation.a(
            "View source",
            href="/sources/pages",
            target="_blank",
            rel="noopener",
        )
        app.h1("Order editor · Genro Pages")
        app.p(
            "Changes commit on blur. Selecting another order discards unsaved edits; "
            "Reset demo restores all seed orders.",
            class_="hint",
        )

    def build_order_list(self, layout):
        """Create the order-selection panel populated by the controller."""
        orders = layout.section(class_="panel", **{"aria-labelledby": "orders-heading"})
        orders.h2("Orders", id="orders-heading")
        order_list = orders.div(class_="order-list", node_id="order_list")
        order_list.span("Loading orders…", hidden=True)

    def build_order_details(self, layout):
        """Compose the selected order's details and controls."""
        editor = layout.section(
            class_="panel", datapath="order", **{"aria-labelledby": "editor-heading"}
        )
        editor.h2("Order details", id="editor-heading")
        form = editor.div()
        self.build_product_details(form)
        self.build_editable_fields(form)
        self.build_total(form)
        self.build_commands(form)

    def build_product_details(self, form):
        """Show the read-only product and unit price."""
        product = form.p()
        product.span("Product: ")
        product.span("^.selected.product", **{"data-testid": "product"})
        unit_price = form.p()
        unit_price.span("Unit price: ")
        unit_price.span("^.selected.unit_price", **{"data-testid": "unit-price"})

    def build_editable_fields(self, form):
        """Add the customer, quantity, note, and fulfillment fields."""
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

    def build_total(self, form):
        """Calculate and display the local order total."""
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
        total = form.p(class_="total")
        total.span("Total: ")
        total.span("^.selected.total", **{"data-testid": "total"})

    def build_commands(self, form):
        """Add save, reset, and request feedback controls."""
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
