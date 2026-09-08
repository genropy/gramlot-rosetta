// Show a static greeting; later examples will make its text editable.
function App() {
  return (
    <>
      <h1>Hello World</h1>
      <div className="description">Display a fixed text. Later examples will let you change it.</div>
      <label className="demo-output">MyText<input readOnly value="Hello World" /></label>
    </>
  )
}

export default App
