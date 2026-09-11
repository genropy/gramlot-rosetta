<script setup>
import {reactive} from 'vue'
const contact = reactive({})
</script>

<template>
  <section class="contact-box" aria-label="Contact details">
    <h2>Contact details</h2>
    <div class="input-fields">
      <label>First name<input v-model.lazy="contact.first_name" /></label>
      <label>Last name<input v-model.lazy="contact.last_name" /></label>
      <label>Phone<input v-model.lazy="contact.phone" /></label>
      <label>Email<input v-model.lazy="contact.email" /></label>
    </div>
  </section>
</template>
