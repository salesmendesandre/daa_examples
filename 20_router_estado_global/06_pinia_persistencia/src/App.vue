<script setup>
import { watch } from 'vue'
import ResumenCarrito from '@/components/ResumenCarrito.vue'
import Catalogo from '@/components/Catalogo.vue'
import { useCarritoStore } from '@/stores/carrito'

const carrito = useCarritoStore()

// Cada vez que cambian los productos, se guardan en el navegador
watch(
  () => carrito.productos,
  (productos) => localStorage.setItem('carrito', JSON.stringify(productos)),
  { deep: true }
)
</script>

<template>
  <div class="component"><ResumenCarrito /></div>
  <div class="component"><Catalogo /></div>
  <p>Recarga la página: el carrito se conserva.</p>
</template>

<style scoped>
.component {
  display: block;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
}
</style>
