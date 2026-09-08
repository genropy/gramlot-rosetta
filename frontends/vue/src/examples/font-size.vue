<!-- Add a continuous font size slider to the styled greeting. -->
<script setup>
import { ref } from 'vue'

const text = ref('Hello World')
const draft = ref(text.value)
const textColor = ref('#223044')
const backgroundColor = ref('#ffffff')
const fontSize = ref(14)
</script>

<template>
  <h1>Font size</h1>
  <div class="description">Adjust the font size.</div>
  <div class="controls">
    <label for="text">Text</label>
    <input id="text" v-model="draft" @blur="text = draft">
    <label for="text-color">Text color</label>
    <input id="text-color" v-model="textColor" type="color" @input="textColor = $event.currentTarget.value">
    <label for="background-color">Background color</label>
    <input id="background-color" v-model="backgroundColor" type="color" @input="backgroundColor = $event.currentTarget.value">
    <label for="font-size">Font size</label>
    <input id="font-size" v-model.number="fontSize" type="range" min="10" max="48" step="1" @input="fontSize = Number($event.currentTarget.value)">
  </div>
  <label class="demo-output">MyText<input readonly :value="text" :style="{ color: textColor, backgroundColor, fontSize: `${fontSize}px` }" /></label>
</template>
