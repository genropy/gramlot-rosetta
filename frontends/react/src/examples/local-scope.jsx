import { useState } from 'react'

// Keep the sample state and controls together in a titled box.
export default function LocalScope() {
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
      <h1>Local scope</h1>
      <div className="description">Arrange text and style controls in two columns inside a labeled box.</div>
      <section className="scoped-example native-scope" aria-label="Text sample">
      <div className="sample-title">Text sample</div>
      <div className="controls compact-controls native-controls">
        <label>Text<input id="text" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} /></label>
        <label>Text color<input id="text-color" type="color" value={textColor} onInput={(event) => setTextColor(event.currentTarget.value)} /></label>
        <label>Background color<input id="background-color" type="color" value={backgroundColor} onInput={(event) => setBackgroundColor(event.currentTarget.value)} /></label>
        <label>Font size<input id="font-size" type="range" min="10" max="48" step="1" value={fontSize} onInput={(event) => setFontSize(Number(event.currentTarget.value))} /></label>
        <label>Font family<select aria-label="Font family" id="font-family" value={fontFamily} onChange={(event) => setFontFamily(event.target.value)}>
          <option value="system-ui">system-ui</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
        </select></label>
        <label>Bold<input type="checkbox" checked={bold} onChange={(event) => setBold(event.target.checked)} /></label>
        <label>Italic<input type="checkbox" checked={italic} onChange={(event) => setItalic(event.target.checked)} /></label>
      </div>
      <label className="demo-output">MyText<input readOnly value={text} style={{ color: textColor, backgroundColor, fontSize, fontFamily, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' }} /></label>
      </section>
    </>
  )
}
