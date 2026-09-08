<!-- Commit an edited greeting when the text field loses focus. -->
<script setup>
import { ref } from 'vue'

const text = ref('Hello World')
const draft = ref(text.value)
</script>

<template>
  <h1>Editable text</h1>
  <div class="description">Edit the greeting text.</div>
  <div class="controls">
    <label for="text">Text</label>
    <input id="text" v-model="draft" @blur="text = draft">
  </div>
  <label class="demo-output">MyText<input readonly :value="text" /></label>
</template>
