<template>
  <h1>Nueva nota</h1>

  <!-- Error al crear, p. ej. un 400 con los detalles de cada campo -->
  <MensajeError v-if="error" :error="error" />

  <form @submit.prevent="crear">
    <input v-model="nueva.title" placeholder="Título" />
    <textarea v-model="nueva.content" placeholder="Texto (opcional)" rows="3"></textarea>
    <button type="submit">Añadir</button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { crearNota } from '../api/notas'
import { normalizarError } from '../api/errores'
import MensajeError from '../components/MensajeError.vue'

const router = useRouter()

// Datos del formulario
const nueva = reactive({ title: '', content: '' })
const error = ref(null)

async function crear() {
  error.value = null
  try {
    // POST sin validar en el cliente: si falta el título, DocuMind responde 400 con los detalles
    await crearNota(nueva)
    // De vuelta al listado, que al mostrarse vuelve a pedir las notas
    router.push({ name: 'notas' })
  } catch (err) {
    error.value = normalizarError(err)
  }
}
</script>
