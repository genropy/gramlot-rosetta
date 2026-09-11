<script setup>
import {reactive} from 'vue'
const contacts = reactive({})
for (let index = 1; index <= 6; index++) contacts[`c${index}`] = {color: '#29384d'}
</script>

<template>
  <div class="contact-cards">
    <section v-for="index in 6" :key="index" class="contact-box" :aria-label="`Contact ${index}`">
      <h2 :style="{backgroundColor: contacts[`c${index}`].color}">Contact {{ index }}</h2>
      <div class="input-fields">
        <label>First name<input v-model.lazy="contacts[`c${index}`].first_name" /></label>
        <label>Last name<input v-model.lazy="contacts[`c${index}`].last_name" /></label>
        <label>Phone<input v-model.lazy="contacts[`c${index}`].phone" /></label>
        <label>Email<input v-model.lazy="contacts[`c${index}`].email" /></label>
        <label>Title background<input type="color" v-model="contacts[`c${index}`].color" /></label>
      </div>
    </section>
  </div>
</template>
