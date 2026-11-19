<template>
  <!-- 4xx: aviso (la petición no era válida); red, timeout o 5xx: error -->
  <div class="mensaje" :class="error.tipo === 'cliente' ? 'aviso' : 'error'" role="alert">
    <strong v-if="error.estado">{{ error.estado }} · </strong>{{ error.mensaje }}
    <!-- Errores de validación: un elemento por campo -->
    <ul v-if="error.detalles.length">
      <li v-for="d in error.detalles" :key="d.campo + d.mensaje">
        <code v-if="d.campo">{{ d.campo }}</code> {{ d.mensaje }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  // Objeto devuelto por normalizarError(): { tipo, estado, mensaje, detalles }
  error: { type: Object, required: true }
})
</script>
