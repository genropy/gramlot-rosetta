import { createApp } from 'vue'
import App from './App.vue'
import EditableText from './examples/editable-text.vue'
import TextColor from './examples/text-color.vue'
import BackgroundColor from './examples/background-color.vue'
import FontSize from './examples/font-size.vue'
import FontFamily from './examples/font-family.vue'
import FontStyle from './examples/font-style.vue'

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

createApp(Example).mount('#app')
