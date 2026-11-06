<script setup>
import ResumenCarrito from '@/components/ResumenCarrito.vue'
import Catalogo from '@/components/Catalogo.vue'
</script>

<template>
  <div class="component"><ResumenCarrito /></div>
  <div class="component"><Catalogo /></div>
  <p>Los dos componentes comparten el mismo carrito.</p>
</template>

<style scoped>
.component {
  display: block;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
}
</style>
