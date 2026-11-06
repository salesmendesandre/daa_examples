<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <v-app>
    <v-main class="pa-4">
      <v-btn color="primary" prepend-icon="mdi-bell" @click="visible = true">
        Mostrar aviso
      </v-btn>

      <v-snackbar v-model="visible" timeout="2500" color="success">
        Acción registrada: el botón funciona
      </v-snackbar>
    </v-main>
  </v-app>
</template>
