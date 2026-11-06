import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    // Al arrancar, se recupera lo guardado en el navegador (o una lista vacía)
    productos: JSON.parse(localStorage.getItem('carrito')) || [],
  }),
  getters: {
    cantidad: (state) => state.productos.length,
    total: (state) => state.productos.reduce((suma, producto) => suma + producto.precio, 0),
  },
  actions: {
    anadir(producto) {
      this.productos.push(producto)
    },
    vaciar() {
      this.productos = []
    },
  },
})
