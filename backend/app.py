"""Common single-process HTTP API; every UI edits exactly the same in-memory orders.

The local demonstration resets on restart. Applications must not send prices or
totals: those belong to the backend. Tests create independent app/store instances.
"""
import json
import os
from copy import deepcopy
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, StrictBool, StrictInt, StrictStr


class OrderChanges(BaseModel):
    model_config = ConfigDict(extra="forbid")
    customer: StrictStr
    quantity: StrictInt
    note: StrictStr
    fulfilled: StrictBool


class OrderStore:
    def __init__(self, fixtures):
        self.fixtures = fixtures
        self.reset_orders()

    def reset_orders(self):
        self.orders = {order["id"]: order for order in json.loads(self.fixtures.read_text())}
        return self.get_orders()

    def get_orders(self):
        return [self.get_order(order_id) for order_id in self.orders]

    def get_order(self, order_id):
        order = self.orders.get(order_id)
        if order is None:
            raise HTTPException(404, "Order not found.")
        return {**deepcopy(order), "total_cents": order["quantity"] * order["unit_price_cents"]}

    def update_order(self, order_id, changes):
        self.get_order(order_id)
        if not changes.customer.strip():
            raise HTTPException(422, "Customer must not be blank.")
        if not 1 <= changes.quantity <= 100:
            raise HTTPException(422, "Quantity must be an integer from 1 to 100.")
        if len(changes.note) > 200:
            raise HTTPException(422, "Note must contain at most 200 characters.")
        self.orders[order_id].update(changes.model_dump())
        self.orders[order_id]["customer"] = changes.customer.strip()
        return self.get_order(order_id)


class DemoServer:
    def __init__(self, root=None, pages=True):
        self.root = Path(root) if root else Path(__file__).resolve().parents[1]
        self.store = OrderStore(self.root / "shared" / "orders.json")
        self.app = FastAPI(title="Demo Rosetta", version="0.1.0")
        self.app.add_exception_handler(RequestValidationError, self.validation_error)
        self.app.add_api_route("/", self.index, include_in_schema=False)
        self.app.add_api_route("/api/orders", self.get_orders, methods=["GET"])
        self.app.add_api_route("/api/orders/{order_id}", self.save_order, methods=["PUT"])
        self.app.add_api_route("/api/reset", self.reset_orders, methods=["POST"])
        self.app.mount("/shared", StaticFiles(directory=self.root / "shared"), name="shared")
        for name in ("react", "vue"):
            build = self.root / "frontends" / name / "dist"
            if build.is_dir():
                self.app.mount(f"/{name}", StaticFiles(directory=build, html=True), name=name)
        if pages:
            self.mount_pages()

    def index(self):
        return RedirectResponse("/react/")

    def get_orders(self):
        return self.store.get_orders()

    def save_order(self, order_id: int, changes: OrderChanges):
        return self.store.update_order(order_id, changes)

    def reset_orders(self):
        return self.store.reset_orders()

    async def validation_error(self, request: Request, exc: RequestValidationError):
        errors = exc.errors()
        field = str(errors[0]["loc"][-1]) if errors else "request"
        return JSONResponse(status_code=422, content={"detail": f"Invalid {field} value."})

    def mount_pages(self):
        # Local optional adapter: its dependencies remain absent in backend-only tests.
        from backend.pages_host import PagesHost
        self.pages_host = PagesHost(self.root)
        self.pages_host.mount(self.app)


def create_app():
    return DemoServer(pages=os.environ.get("ROSETTA_WITH_PAGES", "1") == "1").app
