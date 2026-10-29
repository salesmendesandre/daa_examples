import { onWatcherCleanup, ref, toValue, watch } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const cargando = ref(false)

  let controlador = null

  async function cargar() {
    // Cancela la petición anterior si todavía no ha terminado
    controlador?.abort()
    controlador = new AbortController()
    const { signal } = controlador

    cargando.value = true
    error.value = null

    try {
      const respuesta = await fetch(toValue(url), { signal })
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`)
      }
      const tipo = respuesta.headers.get('content-type') ?? ''
      if (!tipo.includes('application/json')) {
        throw new Error('La respuesta no es JSON')
      }
      data.value = await respuesta.json()
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err
        data.value = null
      }
    } finally {
      if (!signal.aborted) {
        cargando.value = false
      }
    }
  }

  watch(
    () => toValue(url),
    () => {
      cargar()
      // Se ejecuta antes de la siguiente carga y al desmontar el componente
      onWatcherCleanup(() => controlador?.abort())
    },
    { immediate: true }
  )

  return { data, error, cargando, recargar: cargar }
}
