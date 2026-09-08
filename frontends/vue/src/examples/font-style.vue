<!-- Add independent bold and italic toggles to the styled greeting. -->
<script setup>
import { ref } from 'vue'

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
  <h1>Font style</h1>
  <div class="description">Toggle bold and italic styles.</div>
  <div class="controls">
    <label for="text">Text</label>
    <input id="text" v-model="draft" @blur="text = draft">
    <label for="text-color">Text color</label>
    <input id="text-color" v-model="textColor" type="color" @input="textColor = $event.currentTarget.value">
    <label for="background-color">Background color</label>
    <input id="background-color" v-model="backgroundColor" type="color" @input="backgroundColor = $event.currentTarget.value">
    <label for="font-size">Font size</label>
    <input id="font-size" v-model.number="fontSize" type="range" min="10" max="48" step="1" @input="fontSize = Number($event.currentTarget.value)">
    <label for="font-family">Font family</label>
    <select id="font-family" v-model="fontFamily">
      <option value="system-ui">system-ui</option>
      <option value="serif">serif</option>
      <option value="monospace">monospace</option>
    </select>
    <label><input v-model="bold" type="checkbox"> Bold</label>
    <label><input v-model="italic" type="checkbox"> Italic</label>
  </div>
  <label class="demo-output">MyText<input readonly :value="text" :style="{ color: textColor, backgroundColor, fontSize: `${fontSize}px`, fontFamily, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal' }" /></label>
</template>
