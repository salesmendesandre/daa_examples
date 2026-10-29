import { ref } from 'vue'
import { useEventListener } from './useEventListener'

export function useRaton() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (evento) => {
    x.value = evento.pageX
    y.value = evento.pageY
  })

  return { x, y }
}
