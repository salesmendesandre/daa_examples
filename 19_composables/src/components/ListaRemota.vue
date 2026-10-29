<template>
  <section>
    <label>
      Origen de datos:
      <select v-model="origen">
        <option value="tareas">Tareas</option>
        <option value="proyectos">Proyectos</option>
        <option value="inexistente">Archivo inexistente (error)</option>
      </select>
    </label>
    <button @click="recargar" :disabled="cargando">Recargar</button>

    <p v-if="cargando">Cargando…</p>
    <p v-else-if="error" class="error">No se pudieron cargar los datos: {{ error.message }}</p>
    <ul v-else-if="data">
      <li v-for="item in data" :key="item.id">
        {{ item.completada ? '✅' : '⬜' }} {{ item.titulo }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '../composables/useFetch'

const origen = ref('tareas')

// Pasamos un getter: useFetch vuelve a cargar cuando cambia `origen`
const { data, error, cargando, recargar } = useFetch(() => `/datos/${origen.value}.json`)
</script>

<style scoped>
.error {
  color: #dc2626;
}
</style>
