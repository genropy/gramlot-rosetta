import { useState } from 'react'

// Add a live text color control to the editable greeting.
export default function TextColor() {
  const [text, setText] = useState('Hello World')
  const [draft, setDraft] = useState(text)
  const [textColor, setTextColor] = useState('#223044')

  return (
    <>
      <h1>Text color</h1>
      <div className="description">Choose the text color.</div>
      <div className="controls">
        <label htmlFor="text">Text</label>
        <input id="text" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} />
        <label htmlFor="text-color">Text color</label>
        <input id="text-color" type="color" value={textColor} onInput={(event) => setTextColor(event.currentTarget.value)} />
      </div>
      <label className="demo-output">MyText<input readOnly value={text} style={{ color: textColor }} /></label>
    </>
  )
}
