<template>
  <section>
    <form @submit.prevent="anadir">
      <label>
        Nueva nota:
        <input v-model.trim="texto" placeholder="Escribe y pulsa Enter" />
      </label>
      <button type="submit" :disabled="!texto">Añadir</button>
    </form>

    <ul>
      <li v-for="(nota, indice) in notas" :key="indice">
        {{ nota }}
        <button @click="notas.splice(indice, 1)">Eliminar</button>
      </li>
    </ul>
    <p v-if="notas.length === 0">No hay notas guardadas.</p>

    <button @click="restablecer">Borrar todas</button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'

const texto = ref('')
const { valor: notas, restablecer } = useLocalStorage('daa-notas', [])

function anadir() {
  notas.value.push(texto.value)
  texto.value = ''
}
</script>
