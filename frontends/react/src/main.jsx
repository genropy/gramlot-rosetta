import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import EditableText from './examples/editable-text.jsx'
import TextColor from './examples/text-color.jsx'
import BackgroundColor from './examples/background-color.jsx'
import FontSize from './examples/font-size.jsx'
import FontFamily from './examples/font-family.jsx'
import FontStyle from './examples/font-style.jsx'

const examples = {
  'hello-world': App,
  'editable-text': EditableText,
  'text-color': TextColor,
  'background-color': BackgroundColor,
  'font-size': FontSize,
  'font-family': FontFamily,
  'font-style': FontStyle,
}

const exampleId = window.location.pathname.split('/').filter(Boolean).at(-1)
const Example = examples[exampleId] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Example />
  </StrictMode>,
)
