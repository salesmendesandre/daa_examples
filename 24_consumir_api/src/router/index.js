import { createRouter, createWebHistory } from 'vue-router'

// Las vistas se cargan bajo demanda (import dinámico): Vite genera un fichero por vista
const routes = [
  { path: '/', redirect: { name: 'documentos' } },
  {
    path: '/documentos',
    name: 'documentos',
    component: () => import('@/views/DocumentosView.vue')
  },
  {
    path: '/documentos/:id',
    name: 'documento-detalle',
    component: () => import('@/views/DocumentoDetalleView.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrada',
    component: () => import('@/views/NoEncontradaView.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
