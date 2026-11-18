<template>
  <v-chip :color="info.color" size="small" label>{{ info.etiqueta }}</v-chip>
</template>

<script setup>
import { computed } from 'vue'
import { infoEstado } from '@/utils/formato'

const props = defineProps({ estado: { type: String, required: true } })
const info = computed(() => infoEstado(props.estado))
</script>
