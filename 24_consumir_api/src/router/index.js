import { createRouter, createWebHistory } from 'vue-router'
import NotasView from '../views/NotasView.vue'
import NotaNuevaView from '../views/NotaNuevaView.vue'

// Una vista por pantalla: el listado y el alta
const routes = [
  { path: '/', name: 'notas', component: NotasView },
  { path: '/nueva', name: 'nota-nueva', component: NotaNuevaView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
