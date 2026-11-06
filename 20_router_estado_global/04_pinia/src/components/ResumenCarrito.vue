<script setup>
import { useCarritoStore } from '@/stores/carrito'

const carrito = useCarritoStore()
</script>

<template>
  <p>
    Carrito: {{ carrito.cantidad }} productos · Total: {{ carrito.total }} €
    <button @click="carrito.vaciar()">Vaciar</button>
  </p>
</template>
