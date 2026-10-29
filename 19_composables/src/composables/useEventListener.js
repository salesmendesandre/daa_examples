import { onMounted, onUnmounted } from 'vue'

export function useEventListener(objetivo, evento, callback) {
  onMounted(() => objetivo.addEventListener(evento, callback))
  onUnmounted(() => objetivo.removeEventListener(evento, callback))
}
