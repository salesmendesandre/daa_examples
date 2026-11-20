import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import ContactoView from '../views/ContactoView.vue'

const routes = [
  { path: '/', name: 'inicio', component: InicioView },
  { path: '/contacto', name: 'contacto', component: ContactoView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
