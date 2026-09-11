import {useState} from 'react'

export default function RepeatedContacts() {
  const [contacts, setContacts] = useState({})
  const cards = []
  for (let index = 1; index <= 6; index++) {
    const key = `c${index}`
    const contact = contacts[key] || {}
    function commit(event) {
      const {name, value} = event.target
      setContacts(previous => ({...previous, [key]: {...previous[key], [name]: value}}))
    }
    cards.push(<section key={key} className="contact-box" aria-label={`Contact ${index}`}>
      <h2>Contact {index}</h2>
      <div className="input-fields">
        <label>First name<input name="first_name" defaultValue={contact.first_name} onBlur={commit} /></label>
        <label>Last name<input name="last_name" defaultValue={contact.last_name} onBlur={commit} /></label>
        <label>Phone<input name="phone" defaultValue={contact.phone} onBlur={commit} /></label>
        <label>Email<input name="email" defaultValue={contact.email} onBlur={commit} /></label>
      </div>
    </section>)
  }
  return <div className="contact-cards">{cards}</div>
}
