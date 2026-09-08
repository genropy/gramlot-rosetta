<!-- Add a live text color control to the editable greeting. -->
<script setup>
import { ref } from 'vue'

const text = ref('Hello World')
const draft = ref(text.value)
const textColor = ref('#223044')
</script>

<template>
  <h1>Text color</h1>
  <div class="description">Choose the text color.</div>
  <div class="controls">
    <label for="text">Text</label>
    <input id="text" v-model="draft" @blur="text = draft">
    <label for="text-color">Text color</label>
    <input id="text-color" v-model="textColor" type="color" @input="textColor = $event.currentTarget.value">
  </div>
  <div class="demo-output"><span>MyText: </span><span :style="{ color: textColor }">{{ text }}</span></div>
</template>
