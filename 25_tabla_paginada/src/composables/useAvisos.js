import { ref } from 'vue'

// Cola de avisos compartida por toda la aplicación (fuera de la función:
// todos los componentes, y también los interceptores, usan la misma)
const cola = ref([])

// Colores de Vuetify para cada tipo de aviso
const COLORES = { success: 'success', info: 'info', warn: 'warning', error: 'error' }

export function useAvisos() {
  // Añade un aviso. App.vue los muestra con <v-snackbar-queue>
  function add({ severity = 'info', summary, detail, life = 3000 }) {
    cola.value.push({
      text: detail ? `${summary}: ${detail}` : summary,
      color: COLORES[severity],
      timeout: life
    })
  }

  return { cola, add }
}
