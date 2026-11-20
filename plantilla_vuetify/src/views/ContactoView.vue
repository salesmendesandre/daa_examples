<template>
  <h1 class="text-headline-large font-weight-bold mb-4">Contacto</h1>

  <v-card class="pa-4">
    <v-form @submit.prevent="enviar">
      <!-- En PC, nombre y correo en dos columnas; en móvil, uno debajo del otro -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="datos.nombre" label="Nombre" prepend-inner-icon="mdi-account" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="datos.correo" label="Correo" type="email" prepend-inner-icon="mdi-email" />
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="datos.mensaje" label="Mensaje" rows="4" />
        </v-col>
      </v-row>

      <!-- En móvil el botón ocupa todo el ancho -->
      <v-btn type="submit" color="primary" :block="movil">Enviar</v-btn>
    </v-form>
  </v-card>

  <v-snackbar v-model="enviado" color="success">Mensaje enviado (de prueba)</v-snackbar>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown: movil } = useDisplay()

const datos = reactive({ nombre: '', correo: '', mensaje: '' })
const enviado = ref(false)

function enviar() {
  // Aquí iría la petición a la API
  enviado.value = true
}
</script>
