import { ref, shallowRef, watch } from 'vue'
import { normalizarError } from '@/api/errores'

/**
 * Versión para axios del useFetch del capítulo 19.
 *
 * @param peticion  función que hace la petición y devuelve los datos (normalmente, una de src/api/)
 * @param opciones.observar  getter o ref: cuando cambia, se repite la petición
 */
export function useApi(peticion, { observar = null } = {}) {
  const data = shallowRef(null)
  const error = ref(null)
  const cargando = ref(false)

  async function ejecutar() {
    cargando.value = true
    error.value = null
    try {
      data.value = await peticion()
    } catch (err) {
      error.value = normalizarError(err)
    } finally {
      cargando.value = false
    }
  }

  // Con observar, la petición se repite cada vez que cambia; sin él, se lanza una vez
  if (observar) {
    watch(observar, ejecutar, { immediate: true })
  } else {
    ejecutar()
  }

  return { data, error, cargando, recargar: ejecutar }
}
