<template>
  <v-alert :type="error.tipo === 'cliente' ? 'warning' : 'error'" variant="tonal">
    <div class="d-flex flex-column ga-2">
      <span>
        <strong v-if="error.estado">{{ error.estado }} · </strong>{{ error.mensaje }}
      </span>
      <ul v-if="error.detalles.length" class="pl-5">
        <li v-for="d in error.detalles" :key="d.campo + d.mensaje">
          <code v-if="d.campo">{{ d.campo }}</code> {{ d.mensaje }}
        </li>
      </ul>
      <div v-if="reintentable">
        <v-btn prepend-icon="mdi-refresh" size="small" variant="tonal" @click="$emit('reintentar')">Reintentar</v-btn>
      </div>
    </div>
  </v-alert>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Objeto devuelto por normalizarError(): { tipo, estado, mensaje, detalles }
  error: { type: Object, required: true },
  // Muestra el botón «Reintentar» (la vista debe escuchar el evento @reintentar)
  conReintento: { type: Boolean, default: false }
})
defineEmits(['reintentar'])

// Reintentar tiene sentido ante fallos de red o del servidor, no ante un 404 o un 400
const reintentable = computed(() => props.conReintento && props.error.tipo !== 'cliente')
</script>
