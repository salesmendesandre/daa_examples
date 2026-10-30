<template>
  <section>
    <p>Clics: {{ clicks }}</p>
    <button @click="sumarClic">Sumar clic</button>

    <p>{{ usuario.nombre }} tiene {{ usuario.edad }} años</p>
    <button @click="cumplirAnios">Cumplir años</button>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

// ref: un valor simple; en el script se usa .value
const clicks = ref(0)

const sumarClic = () => {
  clicks.value++
}

// reactive: un objeto; sus propiedades se usan directamente
const usuario = reactive({
  nombre: 'Lucía',
  edad: 20
})

const cumplirAnios = () => {
  usuario.edad++
}
</script>
