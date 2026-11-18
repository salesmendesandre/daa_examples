<template>
  <section class="d-flex flex-column align-center ga-3 py-6">
    <v-icon icon="mdi-compass-outline" size="64" class="text-disabled" />
    <h2 class="text-headline-small font-weight-bold">Página no encontrada</h2>
    <v-btn color="primary" prepend-icon="mdi-arrow-left" @click="$router.push({ name: 'documentos' })">Ir a los documentos</v-btn>
  </section>
</template>
