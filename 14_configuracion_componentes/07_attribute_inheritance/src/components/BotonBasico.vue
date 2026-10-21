<template>
  <!-- Elemento raíz: recibe automáticamente los atributos no declarados como props -->
  <button class="boton-basico">
    <slot>Acción</slot>
  </button>
</template>

<script setup>
// No declaramos props: type, aria-label o @click llegan como atributos heredados
</script>

<style scoped>
.boton-basico {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background-color: #22c55e;
  color: #0f172a;
  font-weight: 600;
}
</style>
