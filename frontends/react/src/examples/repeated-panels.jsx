import { useState } from 'react'

// Keep the sample state and controls together in a titled box.
function TextPanel({ title, position }) {
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
      <section className="scoped-example native-scope" aria-label={title} data-label-position={position}>
      <div className="sample-title">{title}</div>
      <div className="panel-content">
      <div className="controls compact-controls native-controls">
        <label className="wide-field"><span>Text</span><input value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} /></label>
        <label><span>Text color</span><input type="color" value={textColor} onInput={(event) => setTextColor(event.currentTarget.value)} /></label>
        <label><span>Background color</span><input type="color" value={backgroundColor} onInput={(event) => setBackgroundColor(event.currentTarget.value)} /></label>
        <label><span>Font size</span><input type="range" min="10" max="48" step="1" value={fontSize} onInput={(event) => setFontSize(Number(event.currentTarget.value))} /></label>
        <label><span>Font family</span><select aria-label="Font family" value={fontFamily} onChange={(event) => setFontFamily(event.target.value)}>
          <option value="system-ui">system-ui</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
        </select></label>
        <label><span>Bold</span><input type="checkbox" checked={bold} onChange={(event) => setBold(event.target.checked)} /></label>
        <label><span>Italic</span><input type="checkbox" checked={italic} onChange={(event) => setItalic(event.target.checked)} /></label>
      </div>
      <label className="demo-output"><span>MyText</span><input readOnly value={text} style={{ color: textColor, backgroundColor, fontSize, fontFamily, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' }} /></label>
      </div>
      </section>
    </>
  )
}

export default function RepeatedPanels() {
  const [position, setPosition] = useState('TL')
  return <>
    <h1>Repeated panels</h1>
    <div className="description">Repeat the same panel six times with independent values.</div>
    <section className="common-settings native-scope" aria-label="Common settings" data-label-position={position}>
      <div className="sample-title">Common settings</div>
      <label><span>Label position</span><select aria-label="Label position" value={position} onChange={event => setPosition(event.target.value)}>
        {['L','R','TL','TC','TR','BL','BC','BR'].map(value => <option key={value}>{value}</option>)}
      </select></label>
    </section>
    {Array.from({ length: 6 }, (_, index) =>
      <TextPanel position={position} key={index} title={`Text sample ${index + 1}`} />)}
  </>
}
