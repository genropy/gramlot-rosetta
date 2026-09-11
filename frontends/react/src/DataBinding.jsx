import {useState} from 'react'

export default function DataBinding() {
  const [liveMessage, setLiveMessage] = useState('Hello World')
  const [message, setMessage] = useState('Hello World')
  return <>
    <h1>{liveMessage}</h1>
    <label>Live<input value={liveMessage} onChange={event => setLiveMessage(event.target.value)} /></label>
    <h1>{message}</h1>
    <label>On focus out<input defaultValue={message} onBlur={event => setMessage(event.target.value)} /></label>
  </>
}
