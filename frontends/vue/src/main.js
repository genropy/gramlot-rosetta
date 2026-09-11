import { createApp } from 'vue'
import App from './App.vue'
import DataBinding from './DataBinding.vue'
import InputWidgets from './InputWidgets.vue'
import ContactBox from './ContactBox.vue'
import RepeatedContacts from './RepeatedContacts.vue'
import ContactColors from './ContactColors.vue'

const lessons = {'hello-world': App, 'data-binding': DataBinding, 'input-widgets': InputWidgets, 'contact-box': ContactBox, 'repeated-contacts': RepeatedContacts, 'contact-colors': ContactColors}
const Lesson = lessons[location.pathname.split('/').filter(Boolean).at(-1)] || App

createApp(Lesson).mount('#app')
