<script setup>
import {reactive} from 'vue'
const data = reactive({})
</script>

<template>
  <div class="input-fields">
    <label>Name<input v-model.lazy="data.name" /></label>
    <label>Quantity<input type="number" v-model.lazy.number="data.quantity" /></label>
    <label>Date<input type="date" v-model.lazy="data.date" /></label>
    <label>Time<input type="time" v-model.lazy="data.time" /></label>
    <label>Updates<input type="checkbox" v-model="data.updates" /></label>
    <label>Notes<textarea rows="3" v-model.lazy="data.notes" /></label>
  </div>
</template>
