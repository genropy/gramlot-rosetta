import { useState } from 'react'

// Add a continuous font size slider to the styled greeting.
export default function FontSize() {
  const [text, setText] = useState('Hello World')
  const [draft, setDraft] = useState(text)
  const [textColor, setTextColor] = useState('#223044')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(14)

  return (
    <>
      <h1>Font size</h1>
      <div className="description">Adjust the font size.</div>
      <div className="controls">
        <label htmlFor="text">Text</label>
        <input id="text" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} />
        <label htmlFor="text-color">Text color</label>
        <input id="text-color" type="color" value={textColor} onInput={(event) => setTextColor(event.currentTarget.value)} />
        <label htmlFor="background-color">Background color</label>
        <input id="background-color" type="color" value={backgroundColor} onInput={(event) => setBackgroundColor(event.currentTarget.value)} />
        <label htmlFor="font-size">Font size</label>
        <input id="font-size" type="range" min="10" max="48" step="1" value={fontSize} onInput={(event) => setFontSize(Number(event.currentTarget.value))} />
      </div>
      <label className="demo-output">MyText<input readOnly value={text} style={{ color: textColor, backgroundColor, fontSize }} /></label>
    </>
  )
}
