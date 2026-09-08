import { useState } from 'react'

// Commit an edited greeting when the text field loses focus.
export default function EditableText() {
  const [text, setText] = useState('Hello World')
  const [draft, setDraft] = useState(text)

  return (
    <>
      <h1>Editable text</h1>
      <div className="description">Edit the greeting text.</div>
      <div className="controls">
        <label htmlFor="text">Text</label>
        <input id="text" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => setText(draft)} />
      </div>
      <label className="demo-output">MyText<input readOnly value={text} /></label>
    </>
  )
}
