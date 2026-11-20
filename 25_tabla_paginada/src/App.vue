<template>
  <v-app>
    <v-app-bar density="comfortable">
      <div class="layout d-flex align-center ga-2 px-3">
        <v-icon icon="mdi-book-open-variant" color="primary" size="large" />
        <span class="font-weight-bold text-title-large">DocuMind</span>
      </div>
    </v-app-bar>

    <v-main>
      <div class="layout pa-3 pa-md-4">
        <DocumentosView />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import DocumentosView from './views/DocumentosView.vue'
</script>

<style scoped>
.layout {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
</style>
