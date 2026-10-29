import { computed, ref } from 'vue'

export function useContador(valorInicial = 0) {
  const cuenta = ref(valorInicial)

  const doble = computed(() => cuenta.value * 2)

  function incrementar(paso = 1) {
    cuenta.value += paso
  }

  function decrementar(paso = 1) {
    cuenta.value -= paso
  }

  function reiniciar() {
    cuenta.value = valorInicial
  }

  return { cuenta, doble, incrementar, decrementar, reiniciar }
}
