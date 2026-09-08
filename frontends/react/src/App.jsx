import { useEffect, useState } from 'react'

const editableFields = ['customer', 'quantity', 'note', 'fulfilled']

function copyDraft(order) {
  return order
    ? Object.fromEntries(editableFields.map((field) => [field, order[field]]))
    : null
}

async function request(path, options) {
  let response
  try {
    response = await fetch(path, options)
  } catch {
    throw new Error('Could not reach the server. Please try again.')
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`
    try {
      const body = await response.json()
      if (typeof body.detail === 'string') message = body.detail
    } catch {
      // Keep the status-based fallback for non-JSON responses.
    }
    throw new Error(message)
  }
  return response.json()
}

function App() {
  const [orders, setOrders] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [busy, setBusy] = useState(true)
  const [feedback, setFeedback] = useState('Loading orders…')

  const selected = orders.find((order) => order.id === selectedId)

  async function loadOrders(path = '/api/orders') {
    setBusy(true)
    setFeedback(path === '/api/reset' ? 'Resetting demo…' : 'Loading orders…')
    try {
      const nextOrders = await request(path, path === '/api/reset' ? { method: 'POST' } : undefined)
      setOrders(nextOrders)
      const first = nextOrders[0] ?? null
      setSelectedId(first?.id ?? null)
      setDraft(copyDraft(first))
      setFeedback('')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  function selectOrder(order) {
    setSelectedId(order.id)
    setDraft(copyDraft(order))
    setFeedback('')
  }

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  async function save(event) {
    event.preventDefault()
    if (!selected || !draft || busy) return

    setBusy(true)
    setFeedback('Saving order…')
    try {
      const saved = await request(`/api/orders/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          quantity: Number(draft.quantity),
        }),
      })
      setOrders((current) => current.map((order) => (order.id === saved.id ? saved : order)))
      setDraft(copyDraft(saved))
      setFeedback('Order saved.')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setBusy(false)
    }
  }

  const total = selected && draft
    ? (Number(draft.quantity) * selected.unit_price_cents) / 100
    : 0

  return (
    <main className="app">
      <nav aria-label="Implementations">
        <a href="/react/" aria-current="page">React</a>
        <a href="/vue/">Vue</a>
        <a href="/pages/">Genro Pages</a>
      </nav>
      <h1>Order editor — React</h1>
      <p className="hint">
        Quantity totals update locally; a committed edit (after blur) is guaranteed to be reflected. Selecting another order or resetting the demo discards unsaved changes.
      </p>

      <div className="layout">
        <section className="panel" aria-labelledby="orders-heading">
          <h2 id="orders-heading">Orders</h2>
          <div className="order-list">
            {orders.map((order) => (
              <button
                type="button"
                key={order.id}
                data-testid={`order-${order.id}`}
                aria-pressed={order.id === selectedId}
                disabled={busy}
                onClick={() => selectOrder(order)}
              >
                #{order.id} — {order.customer}
              </button>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="editor-heading">
          <h2 id="editor-heading">Order details</h2>
          {selected && draft ? (
            <form noValidate onSubmit={save}>
              <label className="field">
                Customer
                <input
                  data-testid="customer"
                  type="text"
                  value={draft.customer}
                  disabled={busy}
                  onChange={(event) => updateDraft('customer', event.target.value)}
                />
              </label>
              <label className="field">
                Product
                <input type="text" value={selected.product} readOnly disabled={busy} />
              </label>
              <label className="field">
                Unit price
                <input type="text" value={`EUR ${(selected.unit_price_cents / 100).toFixed(2)}`} readOnly disabled={busy} />
              </label>
              <label className="field">
                Quantity
                <input
                  data-testid="quantity"
                  type="number"
                  value={draft.quantity}
                  disabled={busy}
                  onChange={(event) => updateDraft('quantity', event.target.value)}
                />
              </label>
              <label className="field">
                Note
                <input
                  data-testid="note"
                  type="text"
                  value={draft.note}
                  disabled={busy}
                  onChange={(event) => updateDraft('note', event.target.value)}
                />
              </label>
              <label className="check">
                <input
                  data-testid="fulfilled"
                  type="checkbox"
                  checked={draft.fulfilled}
                  disabled={busy}
                  onChange={(event) => updateDraft('fulfilled', event.target.checked)}
                />
                Fulfilled
              </label>
              <p className="total">Total: <span data-testid="total">EUR {Number.isFinite(total) ? total.toFixed(2) : '0.00'}</span></p>
              <div className="actions">
                <button className="primary" data-testid="save" type="submit" disabled={busy}>Save</button>
                <button data-testid="reset" type="button" disabled={busy} onClick={() => loadOrders('/api/reset')}>Reset demo</button>
              </div>
            </form>
          ) : (
            <p className="meta">No order is available.</p>
          )}
          <p className="feedback" data-testid="feedback" role="status" aria-live="polite">{feedback}</p>
          {!selected && (
            <div className="actions">
              <button data-testid="reset" type="button" disabled={busy} onClick={() => loadOrders('/api/reset')}>Reset demo</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
