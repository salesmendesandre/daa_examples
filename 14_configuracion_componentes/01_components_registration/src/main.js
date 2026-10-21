import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// Registro GLOBAL (1/2): se importa una sola vez, aquí en main.js
import TarjetaInfo from './components/TarjetaInfo.vue'

const app = createApp(App)
// Registro GLOBAL (2/2): <TarjetaInfo> queda disponible en toda la app
app.component('TarjetaInfo', TarjetaInfo)
app.mount('#app')
