<template>
  <p>Posición del ratón: ({{ x }}, {{ y }})</p>
</template>

<script setup>
import { useRaton } from '../composables/useRaton'

const { x, y } = useRaton()
</script>
