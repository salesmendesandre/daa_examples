<template>
  <h1>Notas</h1>

  <p v-if="cargando">Cargando…</p>
  <MensajeError v-else-if="error" :error="error" />
  <ul v-else class="notas">
    <li v-for="nota in notas" :key="nota._id">
      <div>
        <strong>{{ nota.title }}</strong>
        <p>{{ nota.content }}</p>
      </div>
      <button @click="borrar(nota)">Borrar</button>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { listarNotas, borrarNota } from '../api/notas'
import { normalizarError } from '../api/errores'
import MensajeError from '../components/MensajeError.vue'

// Los tres estados de la petición
const notas = ref([])
const error = ref(null)
const cargando = ref(false)

// GET /notes: se llama al mostrar la vista y después de borrar
async function cargar() {
  cargando.value = true
  error.value = null
  try {
    notas.value = await listarNotas()
  } catch (err) {
    error.value = normalizarError(err)
  } finally {
    cargando.value = false
  }
}

cargar()

// DELETE /notes/:id y, si va bien, se vuelve a pedir el listado
async function borrar(nota) {
  if (!confirm(`¿Borrar la nota «${nota.title}»?`)) return
  try {
    await borrarNota(nota._id)
    await cargar()
  } catch (err) {
    error.value = normalizarError(err)
  }
}
</script>
