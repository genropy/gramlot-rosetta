<!-- Keep the sample state and controls together in a titled box. -->
<script setup>
import { ref } from 'vue'

defineProps({ title: String, position: String })

const text = ref('Hello World')
const draft = ref(text.value)
const textColor = ref('#223044')
const backgroundColor = ref('#ffffff')
const fontSize = ref(14)
const fontFamily = ref('system-ui')
const bold = ref(false)
const italic = ref(false)
</script>

<template>
  <section class="scoped-example native-scope" :aria-label="title" :data-label-position="position">
      <div class="sample-title">{{ title }}</div>
      <div class="panel-content">
      <div class="controls compact-controls native-controls">
    <label class="wide-field"><span>Text</span><input v-model="draft" @blur="text = draft"></label>
    <label><span>Text color</span><input v-model="textColor" type="color" @input="textColor = $event.currentTarget.value"></label>
    <label><span>Background color</span><input v-model="backgroundColor" type="color" @input="backgroundColor = $event.currentTarget.value"></label>
    <label><span>Font size</span><input v-model.number="fontSize" type="range" min="10" max="48" step="1" @input="fontSize = Number($event.currentTarget.value)"></label>
    <label><span>Font family</span><select aria-label="Font family" v-model="fontFamily">
      <option value="system-ui">system-ui</option>
      <option value="serif">serif</option>
      <option value="monospace">monospace</option>
    </select></label>
    <label><span>Bold</span><input v-model="bold" type="checkbox"></label>
    <label><span>Italic</span><input v-model="italic" type="checkbox"></label>
  </div>
  <label class="demo-output"><span>MyText</span><input readonly :value="text" :style="{ color: textColor, backgroundColor, fontSize: `${fontSize}px`, fontFamily, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' }" /></label>
  </div>
  </section>
</template>
