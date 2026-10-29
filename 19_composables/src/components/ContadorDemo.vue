<template>
  <section>
    <div>
      <h3>Contador A</h3>
      <p>Valor: {{ cuenta }} — Doble: {{ doble }}</p>
      <button @click="decrementar()">-1</button>
      <button @click="incrementar()">+1</button>
      <button @click="reiniciar">Reiniciar</button>
    </div>

    <div>
      <h3>Contador B (empieza en 10, paso 5)</h3>
      <p>Valor: {{ cuentaB }}</p>
      <button @click="decrementarB(5)">-5</button>
      <button @click="incrementarB(5)">+5</button>
    </div>
  </section>
</template>

<script setup>
import { useContador } from '../composables/useContador'

// Contador A: se desestructura lo que devuelve el composable
const { cuenta, doble, incrementar, decrementar, reiniciar } = useContador()

// Contador B: otra llamada, con su propio estado. Como sus nombres
// coincidirían con los de A, se renombran al desestructurar
const {
  cuenta: cuentaB,
  incrementar: incrementarB,
  decrementar: decrementarB
} = useContador(10)
</script>
