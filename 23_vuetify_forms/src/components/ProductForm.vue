<script setup>
import { reactive, useTemplateRef } from 'vue'
import { z } from 'zod'

// Esquema de Zod: las reglas de cada campo con sus mensajes de error
const esquema = z.object({
  id: z.string().min(1, { error: 'ID es necesario' }),
  price: z.coerce
    .number({ error: 'Precio debe ser un número' })
    .min(1, { error: 'Precio debe ser al menos 1' })
    .max(1000, { error: 'Precio debe ser como máximo 1000' })
})

// Convierte la regla de Zod de un campo en una regla de Vuetify:
// devuelve true si el valor es válido o el mensaje de error si no lo es
function regla(campo) {
  return (valor) => {
    const resultado = esquema.shape[campo].safeParse(valor)
    return resultado.success || resultado.error.issues[0].message
  }
}

const producto = reactive({
  id: '',
  price: ''
})

// El <v-form> de la plantilla (ref="formulario")
const formulario = useTemplateRef('formulario')

async function onSubmit() {
  // Pide al formulario que compruebe las reglas de todos sus campos
  const { valid } = await formulario.value.validate()
  if (valid) {
    // Aquí iría la acción real (guardar, llamar a una API, etc.)
    console.log('Producto enviado', esquema.parse(producto))
  }
}
</script>

<template>
  <v-card class="mx-auto pa-4" max-width="400">
    <v-card-title>Añadir producto</v-card-title>

    <v-form ref="formulario" @submit.prevent="onSubmit">
      <v-text-field v-model="producto.id" label="ID" :rules="[regla('id')]" />
      <v-text-field v-model="producto.price" label="Precio" type="number" :rules="[regla('price')]" />
      <v-btn type="submit" color="primary" block>Enviar</v-btn>
    </v-form>
  </v-card>
</template>
