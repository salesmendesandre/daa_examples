<template>
  <section class="d-flex flex-column ga-3">
    <h1 class="text-headline-large font-weight-bold">Documentos</h1>

    <!-- Si falla al cambiar de página, el mensaje sale encima y la tabla sigue visible -->
    <MensajeError v-if="error" :error="error" />

    <!-- Primera carga: esqueleto con la forma de la tabla -->
    <v-skeleton-loader v-if="cargando && !respuesta" type="table-thead, table-tbody" aria-busy="true" />

    <!-- La tabla muestra solo la página que devuelve la API -->
    <v-data-table-server
      v-if="respuesta"
      v-model:page="pagina"
      v-model:items-per-page="porPagina"
      v-model:sort-by="orden"
      :headers="COLUMNAS"
      :items="respuesta.data"
      :items-length="respuesta.meta.total"
      :loading="cargando"
      item-value="_id"
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { listarDocumentos } from '../api/documents'
import { normalizarError } from '../api/errores'
import MensajeError from '../components/MensajeError.vue'

// Columnas de la tabla: key es el campo del documento que se muestra (y por el que se ordena)
const COLUMNAS = [
  { title: 'Título', key: 'title' },
  { title: 'Autor', key: 'authorName' },
  { title: 'Estado', key: 'status' }
]

// Estado de la tabla: la tabla los cambia (v-model) cuando el usuario pagina u ordena
const pagina = ref(1)
const porPagina = ref(10)
const orden = ref([{ key: 'createdAt', order: 'desc' }])

// Parámetros para la API, p. ej. { page: 2, limit: 10, sort: '-createdAt' }
const parametros = computed(() => {
  const [criterio] = orden.value
  return {
    page: pagina.value,
    limit: porPagina.value,
    // DocuMind ordena con "campo" (ascendente) o "-campo" (descendente)
    sort: criterio ? `${criterio.order === 'desc' ? '-' : ''}${criterio.key}` : undefined
  }
})

// Los tres estados de la petición; respuesta es { data, meta }
const respuesta = ref(null)
const error = ref(null)
const cargando = ref(false)

// GET /documents con los parámetros de la tabla
async function cargar() {
  cargando.value = true
  error.value = null
  try {
    respuesta.value = await listarDocumentos(parametros.value)
  } catch (err) {
    error.value = normalizarError(err)
  } finally {
    cargando.value = false
  }
}

// Cada vez que cambian los parámetros (página, tamaño u orden) se repite la petición
watch(parametros, cargar, { immediate: true })
</script>
