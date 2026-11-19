<template>
  <h1>Notas</h1>

  <!-- Error al borrar: se avisa, pero la lista sigue visible -->
  <MensajeError v-if="errorBorrar" :error="errorBorrar" />

  <!-- GET: los tres estados de la petición -->
  <MensajeError v-if="error" :error="error" />
  <p v-else-if="cargando && !notas">Cargando…</p>
  <ul v-else-if="notas" class="notas">
    <li v-for="nota in notas" :key="nota._id">
      <div>
        <strong>{{ nota.title }}</strong>
        <p>{{ nota.content }}</p>
      </div>
      <!-- DELETE -->
      <button @click="borrar(nota)">Borrar</button>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { listarNotas, borrarNota } from '../api/notas'
import { normalizarError } from '../api/errores'
import MensajeError from '../components/MensajeError.vue'

// Los tres estados de la petición del listado
const notas = ref(null)
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

// Error al borrar, aparte del error de carga
const errorBorrar = ref(null)

async function borrar(nota) {
  if (!confirm(`¿Borrar la nota «${nota.title}»?`)) return
  errorBorrar.value = null
  try {
    await borrarNota(nota._id)
    await cargar()
  } catch (err) {
    errorBorrar.value = normalizarError(err)
  }
}
</script>
