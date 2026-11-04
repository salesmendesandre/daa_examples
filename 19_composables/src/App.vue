<script setup>
import { ref } from 'vue'
import ContadorDemo from './components/ContadorDemo.vue'
import SeguimientoRaton from './components/SeguimientoRaton.vue'

const mostrarRaton = ref(true)
</script>

<template>
  <div>
    <h1>Composables</h1>

    <section class="component">
      <h2>useContador: estado y funciones reutilizables</h2>
      <ContadorDemo />
    </section>

    <section class="component">
      <h2>useRaton: ciclo de vida y limpieza</h2>
      <label>
        <input type="checkbox" v-model="mostrarRaton" />
        Mostrar el componente (al ocultarlo se deja de escuchar el ratón)
      </label>
      <SeguimientoRaton v-if="mostrarRaton" />
    </section>
  </div>
</template>

<style scoped>
.component {
  display: block;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
}
</style>
