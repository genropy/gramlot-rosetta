import { useState } from 'react'

// Add a live background color control to the styled greeting.
export default function BackgroundColor() {
  const [text, setText] = useState('Hello World')
  const [draft, setDraft] = useState(text)
  const [textColor, setTextColor] = useState('#223044')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')

  return (
    <>
      <h1>Background color</h1>
      <div className="description">Choose the background color.</div>
      <div className="controls">
        <label htmlFor="text">Text</label>
        <input id="text" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} />
        <label htmlFor="text-color">Text color</label>
        <input id="text-color" type="color" value={textColor} onInput={(event) => setTextColor(event.currentTarget.value)} />
        <label htmlFor="background-color">Background color</label>
        <input id="background-color" type="color" value={backgroundColor} onInput={(event) => setBackgroundColor(event.currentTarget.value)} />
      </div>
      <label className="demo-output">MyText<input readOnly value={text} style={{ color: textColor, backgroundColor }} /></label>
    </>
  )
}
