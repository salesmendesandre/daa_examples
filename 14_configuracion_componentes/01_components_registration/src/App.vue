<template>
  <main>
    <h1>Componentes registrados localmente</h1>
    <!-- Registro LOCAL: Saludo solo existe aquí porque lo importamos en el <script setup> -->
    <Saludo nombre="Ada" />
    <h1>Componentes registrados globalmente</h1>
    <!-- Registro GLOBAL: TarjetaInfo no se importa; está registrado en main.js -->
    <TarjetaInfo
      titulo="Componente TarjetaInfo"
      contenido="Este es un componente de tarjeta de información que utiliza props y slots."
    >
      <p>Este es un contenido adicional que se pasa al slot del componente TarjetaInfo.</p>
    </TarjetaInfo>
  </main>
</template>

<script setup>
// Registro local: importar el componente basta para usarlo en la plantilla de arriba
import Saludo from './components/Saludo.vue'
</script>
