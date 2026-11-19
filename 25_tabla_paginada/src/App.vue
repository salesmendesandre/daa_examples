<template>
  <v-app>
    <v-app-bar density="comfortable">
      <div class="layout d-flex align-center ga-4 px-3">
        <RouterLink :to="{ name: 'documentos' }" class="d-flex align-center ga-2 text-decoration-none text-high-emphasis">
          <v-icon icon="mdi-book-open-variant" color="primary" size="large" />
          <span class="font-weight-bold text-title-large">DocuMind</span>
        </RouterLink>
        <RouterLink :to="{ name: 'documentos' }" class="enlace">Documentos</RouterLink>
      </div>
    </v-app-bar>

    <v-main>
      <div class="layout pa-3 pa-md-4">
        <RouterView />
      </div>
    </v-main>

    <!-- Una única cola de avisos para toda la aplicación -->
    <v-snackbar-queue v-model="cola" location="top right" />
  </v-app>
</template>

<script setup>
import { useAvisos } from './composables/useAvisos'

const { cola } = useAvisos()
</script>

<style scoped>
.layout {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.enlace {
  color: rgb(var(--v-theme-on-surface), 0.6);
  text-decoration: none;
}
.enlace.router-link-active {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
