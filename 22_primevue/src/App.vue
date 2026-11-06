<script setup>
import { useToast } from 'primevue/usetoast'

const toast = useToast()

function notify() {
  toast.add({
    severity: 'success',
    summary: 'Acción registrada',
    detail: 'El botón funciona',
    life: 2500
  })
}
</script>

<template>
  <main class="flex gap-2 p-4">
    <Button label="Mostrar Toast" icon="pi pi-bell" @click="notify" />
    <Toast />
  </main>
</template>
