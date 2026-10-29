import { ref } from 'vue'
import { useEventListener } from './useEventListener'

export function useTamanoVentana() {
  const ancho = ref(window.innerWidth)
  const alto = ref(window.innerHeight)

  useEventListener(window, 'resize', () => {
    ancho.value = window.innerWidth
    alto.value = window.innerHeight
  })

  return { ancho, alto }
}
