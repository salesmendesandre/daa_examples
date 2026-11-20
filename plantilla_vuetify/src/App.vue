<template>
  <v-app>
    <v-app-bar color="primary">
      <!-- Móvil: botón que abre el menú lateral -->
      <v-app-bar-nav-icon v-if="movil" @click="menuAbierto = !menuAbierto" />

      <v-app-bar-title>Mi aplicación</v-app-bar-title>

      <!-- PC: los enlaces van en la propia barra -->
      <template v-if="!movil" #append>
        <v-btn v-for="enlace in ENLACES" :key="enlace.ruta" :to="enlace.ruta" :prepend-icon="enlace.icono" exact>
          {{ enlace.texto }}
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Móvil: menú lateral que se cierra al elegir una opción -->
    <v-navigation-drawer v-if="movil" v-model="menuAbierto" temporary>
      <v-list nav>
        <v-list-item
          v-for="enlace in ENLACES"
          :key="enlace.ruta"
          :to="enlace.ruta"
          :prepend-icon="enlace.icono"
          :title="enlace.texto"
          exact
          @click="menuAbierto = false"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

// Enlaces del menú: los mismos en la barra (PC) y en el menú lateral (móvil)
const ENLACES = [
  { texto: 'Inicio', ruta: '/', icono: 'mdi-home' },
  { texto: 'Contacto', ruta: '/contacto', icono: 'mdi-email' }
]

// smAndDown es true en pantallas de menos de 960 px (móvil y tableta pequeña)
const { smAndDown: movil } = useDisplay()

const menuAbierto = ref(false)
</script>
