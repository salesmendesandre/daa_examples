<template>
  <section class="d-flex flex-column ga-3">
    <div>
      <v-btn prepend-icon="mdi-arrow-left" variant="text" :to="{ name: 'documentos' }">Volver al listado</v-btn>
    </div>

    <MensajeError v-if="error" :error="error" />

    <!-- Esqueleto mientras llega el documento -->
    <v-card v-else-if="cargando || !documento" aria-busy="true">
      <v-skeleton-loader type="heading, subtitle, paragraph" />
    </v-card>

    <v-card v-else>
      <v-card-title class="text-wrap">{{ documento.title }}</v-card-title>
      <v-card-subtitle class="text-wrap">
        {{ documento.authorName }} · creado {{ formatearFecha(documento.createdAt) }}
        <span v-if="documento.updatedAt !== documento.createdAt">
          · actualizado {{ formatearFecha(documento.updatedAt) }}
        </span>
      </v-card-subtitle>
      <v-card-text>
        <div class="d-flex flex-wrap align-center ga-2 mb-3">
          <EstadoDocumento :estado="documento.status" />
          <v-chip v-for="tag in documento.tags" :key="tag" color="info" size="small">#{{ tag }}</v-chip>
        </div>
        <p class="contenido ma-0">{{ documento.content }}</p>
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { obtenerDocumento } from '../api/documents'
import { normalizarError } from '../api/errores'
import { formatearFecha } from '../utils/formato'
import EstadoDocumento from '../components/EstadoDocumento.vue'
import MensajeError from '../components/MensajeError.vue'

// props: true en la ruta → el parámetro :id llega como prop
const props = defineProps({ id: { type: String, required: true } })

// Los tres estados de la petición
const documento = ref(null)
const error = ref(null)
const cargando = ref(false)

// GET /documents/:id
async function cargar() {
  cargando.value = true
  error.value = null
  try {
    documento.value = await obtenerDocumento(props.id)
  } catch (err) {
    error.value = normalizarError(err)
  } finally {
    cargando.value = false
  }
}

// Si cambia el id sin desmontar la vista (p. ej. un enlace a otro documento), se vuelve a pedir
watch(() => props.id, cargar, { immediate: true })
</script>

<style scoped>
.contenido {
  white-space: pre-wrap;
  line-height: 1.7;
}
</style>
