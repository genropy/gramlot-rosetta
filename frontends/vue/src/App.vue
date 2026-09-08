<script setup>
import { computed, onMounted, ref } from 'vue'

const orders = ref([])
const selectedId = ref(null)
const draft = ref(null)
const feedback = ref('')
const busy = ref(false)

const total = computed(() => {
  if (!draft.value) return 'EUR 0.00'
  const quantity = Number(draft.value.quantity)
  const cents = Number.isFinite(quantity)
    ? quantity * draft.value.unit_price_cents
    : 0
  return `EUR ${(cents / 100).toFixed(2)}`
})

function makeDraft(order) {
  return order ? { ...order } : null
}

function selectOrder(order) {
  if (busy.value) return
  selectedId.value = order.id
  draft.value = makeDraft(order)
  feedback.value = ''
}

function selectFirst(nextOrders) {
  const first = nextOrders[0] ?? null
  selectedId.value = first?.id ?? null
  draft.value = makeDraft(first)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : 'The request failed.'
}

async function request(url, options) {
  const response = await fetch(url, options)
  let body = null
  try {
    body = await response.json()
  } catch {
    // A proxy or server failure may return an empty or non-JSON response.
  }
  if (!response.ok) {
    throw new Error(body?.detail || `Request failed (${response.status}).`)
  }
  return body
}

async function loadOrders() {
  busy.value = true
  feedback.value = 'Loading orders…'
  try {
    const nextOrders = await request('/api/orders')
    orders.value = nextOrders
    selectFirst(nextOrders)
    feedback.value = ''
  } catch (error) {
    orders.value = []
    selectFirst([])
    feedback.value = `Could not load orders: ${errorMessage(error)}`
  } finally {
    busy.value = false
  }
}

async function saveOrder() {
  if (busy.value || !draft.value) return
  busy.value = true
  feedback.value = 'Saving…'
  const id = draft.value.id
  const payload = {
    customer: draft.value.customer,
    quantity: Number(draft.value.quantity),
    note: draft.value.note,
    fulfilled: draft.value.fulfilled,
  }
  try {
    const saved = await request(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    orders.value = orders.value.map((order) =>
      order.id === saved.id ? saved : order,
    )
    draft.value = makeDraft(saved)
    feedback.value = 'Order saved.'
  } catch (error) {
    feedback.value = `Could not save order: ${errorMessage(error)}`
  } finally {
    busy.value = false
  }
}

async function resetDemo() {
  if (busy.value) return
  busy.value = true
  feedback.value = 'Resetting…'
  try {
    const nextOrders = await request('/api/reset', { method: 'POST' })
    orders.value = nextOrders
    selectFirst(nextOrders)
    feedback.value = ''
  } catch (error) {
    feedback.value = `Could not reset demo: ${errorMessage(error)}`
  } finally {
    busy.value = false
  }
}

onMounted(loadOrders)
</script>

<template>
  <main class="app">
    <nav aria-label="Implementations">
      <a href="/react/">React</a>
      <a href="/vue/" aria-current="page">Vue</a>
      <a href="/pages/">Genro Pages</a>
    </nav>

    <h1>Vue order editor</h1>
    <p class="hint">
      Changes are local until Save. Leaving a quantity field updates the total;
      selecting another order or resetting the demo discards unsaved changes.
    </p>

    <div class="layout">
      <section class="panel" aria-labelledby="orders-heading">
        <h2 id="orders-heading">Orders</h2>
        <div class="order-list">
          <button
            v-for="order in orders"
            :key="order.id"
            type="button"
            :data-testid="`order-${order.id}`"
            :aria-pressed="selectedId === order.id"
            :disabled="busy"
            @click="selectOrder(order)"
          >
            #{{ order.id }} — {{ order.customer }}
          </button>
        </div>
      </section>

      <section class="panel" aria-labelledby="editor-heading">
        <h2 id="editor-heading">Order details</h2>
        <form v-if="draft" novalidate @submit.prevent="saveOrder">
          <label class="field">
            Customer
            <input
              v-model="draft.customer"
              data-testid="customer"
              type="text"
              :disabled="busy"
            />
          </label>

          <label class="field">
            Product
            <input
              :value="draft.product"
              data-testid="product"
              type="text"
              readonly
              :disabled="busy"
            />
          </label>

          <label class="field">
            Unit price
            <input
              :value="`EUR ${(draft.unit_price_cents / 100).toFixed(2)}`"
              data-testid="unit-price"
              type="text"
              readonly
              :disabled="busy"
            />
          </label>

          <label class="field">
            Quantity
            <input
              v-model.number="draft.quantity"
              data-testid="quantity"
              type="number"
              :disabled="busy"
            />
          </label>

          <label class="field">
            Note
            <input
              v-model="draft.note"
              data-testid="note"
              type="text"
              :disabled="busy"
            />
          </label>

          <label class="check">
            <input
              v-model="draft.fulfilled"
              data-testid="fulfilled"
              type="checkbox"
              :disabled="busy"
            />
            Fulfilled
          </label>

          <p class="total">Total: <span data-testid="total">{{ total }}</span></p>

          <div class="actions">
            <button
              class="primary"
              data-testid="save"
              type="submit"
              :disabled="busy"
            >
              Save
            </button>
            <button
              data-testid="reset"
              type="button"
              :disabled="busy"
              @click="resetDemo"
            >
              Reset demo
            </button>
          </div>
        </form>

        <div v-else class="actions">
          <button
            data-testid="reset"
            type="button"
            :disabled="busy"
            @click="resetDemo"
          >
            Reset demo
          </button>
        </div>

        <p class="feedback" data-testid="feedback" role="status">
          {{ feedback }}
        </p>
      </section>
    </div>
  </main>
</template>
