<template>
  <h1 class="text-headline-large font-weight-bold mb-2">Inicio</h1>
  <p class="mb-4">
    Tamaño de pantalla actual: <v-chip color="primary" size="small">{{ name }}</v-chip>
  </p>

  <!-- Rejilla: 1 tarjeta por fila en móvil, 2 en tableta y 3 en PC -->
  <v-row>
    <v-col v-for="tarjeta in TARJETAS" :key="tarjeta.titulo" cols="12" sm="6" md="4">
      <v-card :prepend-icon="tarjeta.icono" :title="tarjeta.titulo" :text="tarjeta.texto" height="100%" />
    </v-col>
  </v-row>
</template>

<script setup>
import { useDisplay } from 'vuetify'

// name es el punto de corte actual de Vuetify: xs, sm, md, lg, xl o xxl
const { name } = useDisplay()

const TARJETAS = [
  { titulo: 'Rejilla', icono: 'mdi-view-grid', texto: 'v-row y v-col reparten el ancho en 12 columnas.' },
  { titulo: 'Puntos de corte', icono: 'mdi-arrow-expand-horizontal', texto: 'cols, sm y md indican cuántas columnas ocupa cada tarjeta según el ancho.' },
  { titulo: 'Navegación', icono: 'mdi-menu', texto: 'En PC los enlaces van en la barra; en móvil, en un menú lateral.' },
  { titulo: 'useDisplay', icono: 'mdi-monitor-cellphone', texto: 'Indica desde el código el tamaño de pantalla actual.' },
  { titulo: 'Vue Router', icono: 'mdi-routes', texto: 'Cada opción del menú es una ruta con su propia vista.' },
  { titulo: 'Tema', icono: 'mdi-palette', texto: 'Los colores salen del tema de Vuetify, configurado en plugins/vuetify.js.' }
]
</script>
