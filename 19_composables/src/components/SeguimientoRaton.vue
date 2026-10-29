<template>
  <section>
    <p>Posición del ratón: ({{ x }}, {{ y }})</p>
    <p>Tamaño de la ventana: {{ ancho }} × {{ alto }} px</p>
  </section>
</template>

<script setup>
import { useRaton } from '../composables/useRaton'
import { useTamanoVentana } from '../composables/useTamanoVentana'

const { x, y } = useRaton()
const { ancho, alto } = useTamanoVentana()
</script>
