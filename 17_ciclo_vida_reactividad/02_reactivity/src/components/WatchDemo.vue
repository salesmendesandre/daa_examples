<template>
  <section>
    <label>
      Número:
      <input type="number" v-model.number="numero" />
    </label>
    <p>Número actual: {{ numero }}</p>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const numero = ref(0)

watch(numero, (nuevo, anterior) => {
  console.log(`El número cambió de ${anterior} a ${nuevo}`)
})
</script>