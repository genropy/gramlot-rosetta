import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DataBinding from './DataBinding.jsx'
import InputWidgets from './InputWidgets.jsx'
import ContactBox from './ContactBox.jsx'
import RepeatedContacts from './RepeatedContacts.jsx'
import ContactColors from './ContactColors.jsx'

const lessons = {'hello-world': App, 'data-binding': DataBinding, 'input-widgets': InputWidgets, 'contact-box': ContactBox, 'repeated-contacts': RepeatedContacts, 'contact-colors': ContactColors}
const Lesson = lessons[location.pathname.split('/').filter(Boolean).at(-1)] || App

createRoot(document.getElementById('root')).render(<StrictMode><Lesson /></StrictMode>)
