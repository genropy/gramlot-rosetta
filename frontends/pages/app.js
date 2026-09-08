import {Application, HtmlBuilder} from 'genro-dom-js';
import {fromTytx} from 'genro-tytx';
import '/pages/assets/dom/collections/inputs.js';


class OrdersBuilder extends HtmlBuilder {
    static data_recipe_alias = true;
    static wc_requires = ['inputs'];
}


class OrdersController {
    constructor(application) {
        this.application = application;
        this.orders = [];
        this.selectedId = null;
        this.pending = true;
        this.disposed = false;
        this.request = null;
    }

    async load() {
        await this._replaceOrders('/api/orders', {method: 'GET'});
    }

    async reset() {
        if (this.pending || this.disposed) return;
        await this._replaceOrders('/api/reset', {method: 'POST'});
    }

    select(orderId) {
        if (this.pending || this.disposed) return;
        const order = this.orders.find(item => item.id === orderId);
        if (!order) return;
        this.selectedId = orderId;
        this.application.live(() => {
            this._writeDraft(order);
            this._setData('order.feedback', '');
            this._renderOrders();
        });
    }

    async save() {
        if (this.pending || this.disposed || this.selectedId === null) return;
        this._setPending(true);
        const data = this.application.data;
        const changes = {
            customer: data.getItem('main.order.selected.customer'),
            quantity: Number(data.getItem('main.order.selected.quantity')),
            note: data.getItem('main.order.selected.note'),
            fulfilled: data.getItem('main.order.selected.fulfilled'),
        };
        try {
            const saved = await this._fetchJson(`/api/orders/${this.selectedId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(changes),
            });
            if (this.disposed) return;
            this.orders = this.orders.map(order => order.id === saved.id ? saved : order);
            this.application.live(() => {
                this._writeDraft(saved);
                this._setData('order.feedback', 'Order saved.');
                this._setData('order.pending', false);
                this._renderOrders();
            });
            this.pending = false;
        } catch (error) {
            this._finishError(error);
        }
    }

    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.request?.abort();
        this.application.dispose();
    }

    async _replaceOrders(url, options) {
        if (this.disposed) return;
        this._setPending(true);
        try {
            const orders = await this._fetchJson(url, options);
            if (this.disposed) return;
            this.orders = orders;
            this.selectedId = orders[0]?.id ?? null;
            this.application.live(() => {
                if (orders[0]) this._writeDraft(orders[0]);
                this._setData('order.feedback', '');
                this._setData('order.pending', false);
                this._renderOrders();
            });
            this.pending = false;
        } catch (error) {
            this._finishError(error);
        }
    }

    async _fetchJson(url, options) {
        this.request?.abort();
        this.request = new AbortController();
        const response = await fetch(url, {...options, signal: this.request.signal});
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.detail || `Request failed (${response.status}).`);
        return body;
    }

    _finishError(error) {
        if (this.disposed || error.name === 'AbortError') return;
        this.application.live(() => {
            this._setData('order.feedback', error.message || 'Network request failed.');
            this._setData('order.pending', false);
        });
        this.pending = false;
    }

    _setPending(pending) {
        this.pending = pending;
        this.application.live(() => {
            this._setData('order.pending', pending);
            if (pending) this._setData('order.feedback', '');
        });
    }

    _setData(path, value) {
        this.application.data.setItem(`main.${path}`, value);
    }

    _writeDraft(order) {
        this._setData('order.selected.id', order.id);
        this._setData('order.selected.customer', order.customer);
        this._setData('order.selected.product', order.product);
        this._setData('order.selected.quantity', order.quantity);
        this._setData('order.selected.unit_price_cents', order.unit_price_cents);
        this._setData(
            'order.selected.unit_price',
            `EUR ${(order.unit_price_cents / 100).toFixed(2)}`,
        );
        this._setData('order.selected.note', order.note);
        this._setData('order.selected.fulfilled', order.fulfilled);
    }

    _renderOrders() {
        const list = this.application.builder.nodeById('order_list');
        for (const node of [...list.value.getNodes()]) list.value.popNode(node.label);
        for (const order of this.orders) {
            list.button(`#${order.id} · ${order.customer}`, {
                action: 'genro.controller.select(order_id);',
                order_id: order.id,
                disabled: '^order.pending',
                'aria-pressed': order.id === this.selectedId,
                'data-testid': `order-${order.id}`,
            });
        }
    }
}


async function start() {
    const sourceResponse = await fetch('/pages/recipe');
    if (!sourceResponse.ok) throw new Error(`Recipe request failed (${sourceResponse.status}).`);
    const builder = new OrdersBuilder('main');
    builder.loadSource(fromTytx(await sourceResponse.text(), 'json'));
    const application = new Application(document.getElementById('root'));
    const controller = new OrdersController(application);
    application.controller = controller;
    application.mountBuilder(builder);
    window.genro = application;
    window.addEventListener('pagehide', () => controller.dispose(), {once: true});
    await controller.load();
}


start().catch(error => {
    const message = document.getElementById('bootstrap-error');
    message.hidden = false;
    message.textContent = error.message || 'Unable to start Genro Pages.';
    console.error(error);
});
