<template>
  <section>
    <p>Invitados ({{ invitados.length }}): {{ invitados.join(', ') }}</p>
    <button @click="anadir">Añadir invitado</button>
    <button @click="quitarPrimero">Quitar el primero</button>

    <p>Tareas: {{ tareas.join(', ') || 'ninguna' }}</p>
    <button @click="vaciar">Vaciar tareas</button>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Array reactive: se modifica con sus métodos, nunca se reasigna
const invitados = reactive(['Ana', 'Luis'])
let siguiente = 1

const anadir = () => {
  invitados.push(`Invitado ${siguiente++}`)
}

const quitarPrimero = () => {
  invitados.splice(0, 1)
}

// Array dentro de un ref: además de sus métodos, admite sustituirlo entero
const tareas = ref(['Repasar ref', 'Repasar reactive'])

const vaciar = () => {
  tareas.value = []
}
</script>
