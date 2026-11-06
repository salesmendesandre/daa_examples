import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    productos: [],
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
