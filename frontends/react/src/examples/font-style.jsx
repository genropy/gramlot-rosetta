import { useState } from 'react'

// Add independent bold and italic toggles to the styled greeting.
export default function FontStyle() {
  const [text, setText] = useState('Hello World')
  const [draft, setDraft] = useState(text)
  const [textColor, setTextColor] = useState('#223044')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('system-ui')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)

  return (
    <>
      <h1>Font style</h1>
      <div className="description">Toggle bold and italic styles.</div>
      <div className="controls">
        <label htmlFor="text">Text</label>
        <input id="text" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} />
        <label htmlFor="text-color">Text color</label>
        <input id="text-color" type="color" value={textColor} onInput={(event) => setTextColor(event.currentTarget.value)} />
        <label htmlFor="background-color">Background color</label>
        <input id="background-color" type="color" value={backgroundColor} onInput={(event) => setBackgroundColor(event.currentTarget.value)} />
        <label htmlFor="font-size">Font size</label>
        <input id="font-size" type="range" min="10" max="48" step="1" value={fontSize} onInput={(event) => setFontSize(Number(event.currentTarget.value))} />
        <label htmlFor="font-family">Font family</label>
        <select id="font-family" value={fontFamily} onChange={(event) => setFontFamily(event.target.value)}>
          <option value="system-ui">system-ui</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
        </select>
        <label><input type="checkbox" checked={bold} onChange={(event) => setBold(event.target.checked)} /> Bold</label>
        <label><input type="checkbox" checked={italic} onChange={(event) => setItalic(event.target.checked)} /> Italic</label>
      </div>
      <div className="demo-output">
        <span>MyText: </span>
        <span style={{ color: textColor, backgroundColor, fontSize, fontFamily, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' }}>{text}</span>
      </div>
    </>
  )
}
