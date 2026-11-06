import { createRouter, createWebHistory } from 'vue-router'
import ProductosLayout from '@/views/ProductosLayout.vue'
import ProductoListado from '@/views/ProductoListado.vue'
import ProductoCrear from '@/views/ProductoCrear.vue'
import ProductoDetalle from '@/views/ProductoDetalle.vue'
import ProductoEditar from '@/views/ProductoEditar.vue'

const routes = [
  {
    path: '/productos',
    component: ProductosLayout,
    children: [
      { path: '', name: 'productos-listado', component: ProductoListado }, // Read
      { path: 'nuevo', name: 'producto-crear', component: ProductoCrear }, // Create
      { path: ':id', name: 'producto-detalle', component: ProductoDetalle }, // Read detail
      { path: ':id/editar', name: 'producto-editar', component: ProductoEditar }, // Update
    ],
  },
  // La raíz lleva al listado de productos
  { path: '/', redirect: '/productos' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
