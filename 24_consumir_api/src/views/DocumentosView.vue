<template>
  <section class="d-flex flex-column ga-3">
    <h1 class="text-headline-large font-weight-bold">Documentos</h1>

    <!-- Error: mensaje con la opción de reintentar -->
    <MensajeError v-if="error" :error="error" con-reintento @reintentar="recargar" />

    <!-- Mientras llega la respuesta: esqueleto con la forma de la lista -->
    <v-skeleton-loader v-else-if="cargando" type="list-item-two-line@5" aria-busy="true" />

    <!-- Datos: data.data son los documentos y data.meta, los datos de paginación -->
    <v-card v-else-if="data">
      <v-list lines="two">
        <v-list-item
          v-for="doc in data.data"
          :key="doc._id"
          :to="{ name: 'documento-detalle', params: { id: doc._id } }"
          :title="doc.title"
          :subtitle="`${doc.authorName} · ${formatearFecha(doc.createdAt)}`"
        >
          <template #append>
            <EstadoDocumento :estado="doc.status" />
          </template>
        </v-list-item>
      </v-list>
      <v-card-text class="text-medium-emphasis">
        Se muestran {{ data.data.length }} de {{ data.meta.total }} documentos
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup>
import { listarDocumentos } from '@/api/documents'
import { useApi } from '@/composables/useApi'
import { formatearFecha } from '@/utils/formato'
import EstadoDocumento from '@/components/EstadoDocumento.vue'
import MensajeError from '@/components/MensajeError.vue'

// Sin parámetros, DocuMind devuelve la primera página: los 10 documentos más recientes
const { data, error, cargando, recargar } = useApi(() => listarDocumentos())
</script>
