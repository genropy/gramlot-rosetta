<script setup>
import {ref} from 'vue'
const liveMessage = ref('Hello World')
const message = ref('Hello World')
</script>

<template>
  <h1>{{ liveMessage }}</h1>
  <label>Live<input v-model="liveMessage" /></label>
  <h1>{{ message }}</h1>
  <label>On focus out<input :value="message" @blur="message = $event.target.value" /></label>
</template>
