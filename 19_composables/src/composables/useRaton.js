import { onMounted, onUnmounted, ref } from 'vue'

export function useRaton() {
  const x = ref(0)
  const y = ref(0)

  function actualizar(evento) {
    x.value = evento.pageX
    y.value = evento.pageY
  }

  // Se escucha el ratón solo mientras el componente está montado
  onMounted(() => window.addEventListener('mousemove', actualizar))
  onUnmounted(() => window.removeEventListener('mousemove', actualizar))

  return { x, y }
}
