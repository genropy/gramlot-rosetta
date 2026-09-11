import {useState} from 'react'

export default function ContactBox() {
  const [contact, setContact] = useState({})
  function commit(event) {
    const {name, value} = event.target
    setContact(previous => ({...previous, [name]: value}))
  }
  return <section className="contact-box" aria-label="Contact details">
    <h2>Contact details</h2>
    <div className="input-fields">
      <label>First name<input name="first_name" defaultValue={contact.first_name} onBlur={commit} /></label>
      <label>Last name<input name="last_name" defaultValue={contact.last_name} onBlur={commit} /></label>
      <label>Phone<input name="phone" defaultValue={contact.phone} onBlur={commit} /></label>
      <label>Email<input name="email" defaultValue={contact.email} onBlur={commit} /></label>
    </div>
  </section>
}
