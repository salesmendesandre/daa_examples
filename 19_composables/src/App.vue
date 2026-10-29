<script setup>
import { ref } from 'vue'
import ContadorDemo from './components/ContadorDemo.vue'
import SeguimientoRaton from './components/SeguimientoRaton.vue'
import NotasPersistentes from './components/NotasPersistentes.vue'
import ListaRemota from './components/ListaRemota.vue'

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
      <h2>useRaton y useTamanoVentana: ciclo de vida y limpieza</h2>
      <label>
        <input type="checkbox" v-model="mostrarRaton" />
        Mostrar el componente (al ocultarlo se eliminan los listeners)
      </label>
      <SeguimientoRaton v-if="mostrarRaton" />
    </section>

    <section class="component">
      <h2>useLocalStorage: estado persistente</h2>
      <NotasPersistentes />
    </section>

    <section class="component">
      <h2>useFetch: datos asíncronos</h2>
      <ListaRemota />
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
