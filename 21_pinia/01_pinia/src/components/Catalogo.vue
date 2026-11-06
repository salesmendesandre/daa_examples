<script setup>
import { useCarritoStore } from '@/stores/carrito'

const carrito = useCarritoStore()

const productos = [
  { id: 1, nombre: 'Camiseta', precio: 15 },
  { id: 2, nombre: 'Taza', precio: 8 },
  { id: 3, nombre: 'Cuaderno', precio: 5 },
]
</script>

<template>
  <ul>
    <li v-for="producto in productos" :key="producto.id">
      {{ producto.nombre }} ({{ producto.precio }} €)
      <button @click="carrito.anadir(producto)">Añadir</button>
    </li>
  </ul>
</template>
