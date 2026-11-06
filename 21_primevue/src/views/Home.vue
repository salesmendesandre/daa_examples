<script setup>
import { computed } from 'vue'
import { useCounterStore } from '../stores/counter'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const store = useCounterStore()
const toast = useToast()
const router = useRouter()

const doubled = computed(() => store.count * 2)

function increment() {
  store.increment()
  toast.add({
    severity: 'info',
    summary: 'Contador actualizado',
    detail: `Nuevo valor: ${store.count}`,
    life: 3000
  })
}

function goAbout() {
  router.push('/about')
}
</script>

<template>
  <section class="bg-white rounded-lg p-4 shadow flex flex-col gap-3">
    <h2 class="text-2xl font-bold">Inicio</h2>
    <p>Valor: {{ store.count }} (doble: {{ doubled }})</p>
    <div class="flex gap-2">
      <Button label="Incrementar" icon="pi pi-plus" @click="increment" />
      <Button label="Ir a About" icon="pi pi-arrow-right" severity="help" @click="goAbout" />
    </div>
    <Toast />
  </section>
</template>
