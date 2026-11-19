<template>
  <!-- 4xx: aviso (la petición no era válida); red, timeout o 5xx: error -->
  <v-alert :type="error.tipo === 'cliente' ? 'warning' : 'error'" variant="tonal">
    <div class="d-flex flex-column ga-2">
      <span>
        <strong v-if="error.estado">{{ error.estado }} · </strong>{{ error.mensaje }}
      </span>
      <!-- Errores de validación: un elemento por campo -->
      <ul v-if="error.detalles.length" class="pl-5">
        <li v-for="d in error.detalles" :key="d.campo + d.mensaje">
          <code v-if="d.campo">{{ d.campo }}</code> {{ d.mensaje }}
        </li>
      </ul>
    </div>
  </v-alert>
</template>

<script setup>
defineProps({
  // Objeto devuelto por normalizarError(): { tipo, estado, mensaje, detalles }
  error: { type: Object, required: true }
})
</script>
