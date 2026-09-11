import {useState} from 'react'

export default function InputWidgets() {
  const [data, setData] = useState({})
  function commit(event) {
    const {name, type, value, checked, valueAsNumber} = event.target
    setData(previous => ({...previous, [name]: type === 'checkbox' ? checked
      : type === 'number' ? (value === '' ? null : valueAsNumber) : value}))
  }
  return <div className="input-fields">
    <label>Name<input name="name" defaultValue={data.name} onBlur={commit} /></label>
    <label>Quantity<input name="quantity" type="number" defaultValue={data.quantity} onBlur={commit} /></label>
    <label>Date<input name="date" type="date" defaultValue={data.date} onBlur={commit} /></label>
    <label>Time<input name="time" type="time" defaultValue={data.time} onBlur={commit} /></label>
    <label>Updates<input name="updates" type="checkbox" checked={!!data.updates} onChange={commit} /></label>
    <label>Notes<textarea aria-label="Notes" name="notes" rows="3" defaultValue={data.notes} onBlur={commit} /></label>
  </div>
}
