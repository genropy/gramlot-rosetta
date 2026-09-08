<script setup>
import { ref } from 'vue'
const position = ref('TL')
import TextPanel from './repeated-panel.vue'
</script>

<template>
  <h1>Repeated panels</h1>
  <div class="description">Repeat the same panel six times with independent values.</div>
  <section class="common-settings native-scope" aria-label="Common settings" :data-label-position="position">
    <div class="sample-title">Common settings</div>
    <label><span>Label position</span><select aria-label="Label position" v-model="position">
      <option v-for="value in ['L','R','TL','TC','TR','BL','BC','BR']" :key="value">{{ value }}</option>
    </select></label>
  </section>
  <TextPanel :position="position" v-for="index in 6" :key="index" :title="`Text sample ${index}`" />
</template>
