<!-- Add a live background color control to the styled greeting. -->
<script setup>
import { ref } from 'vue'

const text = ref('Hello World')
const draft = ref(text.value)
const textColor = ref('#223044')
const backgroundColor = ref('#ffffff')
</script>

<template>
  <h1>Background color</h1>
  <div class="description">Choose the background color.</div>
  <div class="controls">
    <label for="text">Text</label>
    <input id="text" v-model="draft" @blur="text = draft">
    <label for="text-color">Text color</label>
    <input id="text-color" v-model="textColor" type="color" @input="textColor = $event.currentTarget.value">
    <label for="background-color">Background color</label>
    <input id="background-color" v-model="backgroundColor" type="color" @input="backgroundColor = $event.currentTarget.value">
  </div>
  <div class="demo-output"><span>MyText: </span><span :style="{ color: textColor, backgroundColor }">{{ text }}</span></div>
</template>
