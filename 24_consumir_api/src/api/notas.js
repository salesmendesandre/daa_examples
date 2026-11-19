import { apiClient } from './client'

// Servicio de notas: una función por endpoint. Cada una devuelve directamente
// los datos de la respuesta (response.data), de modo que las vistas no ven axios.

/** GET /notes → array de notas (las fijadas, primero) */
export async function listarNotas() {
  const { data } = await apiClient.get('/notes')
  return data
}

/** POST /notes → la nota creada (201) */
export async function crearNota(nota) {
  const { data } = await apiClient.post('/notes', nota)
  return data
}

/** DELETE /notes/:id → 204, sin cuerpo */
export async function borrarNota(id) {
  await apiClient.delete(`/notes/${id}`)
}
