<template>
  <section class="d-flex flex-column ga-3">
    <div class="d-flex flex-wrap align-center justify-space-between ga-2">
      <h1 class="text-headline-large font-weight-bold">Documentos</h1>
      <span v-if="data" class="text-medium-emphasis">{{ data.meta.total }} documentos</span>
    </div>

    <!-- Error sin datos que mostrar: mensaje en la propia página -->
    <MensajeError v-if="error && !data" :error="error" />

    <!-- Primera carga: esqueleto con la forma de la tabla -->
    <v-skeleton-loader v-else-if="cargando && !data" type="table-thead, table-tbody" aria-busy="true" />

    <!-- La tabla muestra solo la página que devuelve la API -->
    <v-data-table-server
      v-else-if="data"
      v-model:page="pagina"
      v-model:items-per-page="porPagina"
      v-model:sort-by="orden"
      :headers="COLUMNAS"
      :items="data.data"
      :items-length="data.meta.total"
      :items-per-page-options="[5, 10, 20]"
      :loading="cargando"
      item-value="_id"
      striped="even"
    >
      <template #item.title="{ item: doc }">
        <RouterLink :to="{ name: 'documento-detalle', params: { id: doc._id } }" class="font-weight-medium text-primary">
          {{ doc.title }}
        </RouterLink>
      </template>
      <template #item.tags="{ item: doc }">
        <div class="d-flex flex-wrap ga-1">
          <v-chip v-for="tag in doc.tags" :key="tag" color="info" size="small">#{{ tag }}</v-chip>
        </div>
      </template>
      <template #item.status="{ item: doc }">
        <EstadoDocumento :estado="doc.status" />
      </template>
      <template #item.createdAt="{ item: doc }">{{ formatearFecha(doc.createdAt) }}</template>
    </v-data-table-server>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { listarDocumentos } from '../api/documents'
import { normalizarError } from '../api/errores'
import { useAvisos } from '../composables/useAvisos'
import { formatearFecha } from '../utils/formato'
import EstadoDocumento from '../components/EstadoDocumento.vue'
import MensajeError from '../components/MensajeError.vue'

// Columnas de la tabla: key es el campo del documento que se muestra (y por el que se ordena)
const COLUMNAS = [
  { title: 'Título', key: 'title' },
  { title: 'Etiquetas', key: 'tags', sortable: false },
  { title: 'Estado', key: 'status' },
  { title: 'Autor', key: 'authorName' },
  { title: 'Creado', key: 'createdAt' }
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

// Los tres estados de la petición
const data = ref(null)
const error = ref(null)
const cargando = ref(false)

// GET /documents con los parámetros de la tabla
async function cargar() {
  cargando.value = true
  error.value = null
  try {
    data.value = await listarDocumentos(parametros.value)
  } catch (err) {
    error.value = normalizarError(err)
  } finally {
    cargando.value = false
  }
}

// Cada vez que cambian los parámetros (página, tamaño u orden) se repite la petición
watch(parametros, cargar, { immediate: true })

// Si falla una carga cuando ya hay datos en pantalla, no los borramos: lo avisamos
const avisos = useAvisos()
watch(error, (nuevo) => {
  if (nuevo && data.value) {
    avisos.add({ severity: 'error', summary: 'No se pudo actualizar el listado', detail: nuevo.mensaje, life: 5000 })
  }
})
</script>
