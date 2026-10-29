import { ref, watch } from 'vue'

export function useLocalStorage(clave, valorInicial) {
  function leer() {
    try {
      const guardado = localStorage.getItem(clave)
      return guardado !== null ? JSON.parse(guardado) : structuredClone(valorInicial)
    } catch (error) {
      console.warn(`No se pudo leer «${clave}» de localStorage`, error)
      return structuredClone(valorInicial)
    }
  }

  const valor = ref(leer())

  watch(
    valor,
    (nuevo) => {
      try {
        localStorage.setItem(clave, JSON.stringify(nuevo))
      } catch (error) {
        console.warn(`No se pudo guardar «${clave}» en localStorage`, error)
      }
    },
    { deep: true }
  )

  function restablecer() {
    valor.value = structuredClone(valorInicial)
  }

  return { valor, restablecer }
}
