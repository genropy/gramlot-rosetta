import { useState } from 'react'

// Add a font family choice to the styled greeting.
export default function FontFamily() {
  const [text, setText] = useState('Hello World')
  const [draft, setDraft] = useState(text)
  const [textColor, setTextColor] = useState('#223044')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState('system-ui')

  return (
    <>
      <h1>Font family</h1>
      <div className="description">Choose the font family.</div>
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
      </div>
      <label className="demo-output">MyText<input readOnly value={text} style={{ color: textColor, backgroundColor, fontSize, fontFamily }} /></label>
    </>
  )
}
