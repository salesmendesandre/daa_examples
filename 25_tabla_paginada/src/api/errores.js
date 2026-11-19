import axios from 'axios'

/**
 * Convierte cualquier error de una petición en un objeto uniforme para la interfaz:
 * { tipo, estado, mensaje, detalles }.
 *
 * - tipo 'red':      no hubo respuesta (API apagada, URL mal configurada, CORS…).
 * - tipo 'timeout':  la API tardó más que el timeout del cliente.
 * - tipo 'cliente':  respuesta 4xx (la petición no era válida o no estaba permitida).
 * - tipo 'servidor': respuesta 5xx (fallo dentro de la API).
 */
export function normalizarError(error) {
  if (!axios.isAxiosError(error)) {
    return { tipo: 'desconocido', estado: null, mensaje: error?.message ?? 'Error inesperado', detalles: [] }
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return { tipo: 'timeout', estado: null, mensaje: 'La API ha tardado demasiado en responder.', detalles: [] }
  }

  if (!error.response) {
    return {
      tipo: 'red',
      estado: null,
      mensaje: `No se pudo conectar con la API (${error.config?.baseURL}). ¿Está DocuMind arrancado?`,
      detalles: []
    }
  }

  // Hay respuesta: la API ha contestado con un código de error (4xx o 5xx).
  // DocuMind responde { error, details? } (validación) o { error } (resto de errores)
  const { status, data } = error.response

  // details solo llega en los errores de validación (400). Se convierte en una lista de
  // { campo, mensaje }; el nombre del campo viene en field (cuerpo) o en param (query string).
  // ?. evita un fallo si la respuesta no trae cuerpo y ?? se queda con el primer valor que exista
  const detalles = Array.isArray(data?.details)
    ? data.details.map((d) => ({ campo: d.field ?? d.param ?? '', mensaje: d.message }))
    : []

  return {
    // 500 o más: ha fallado el servidor; de 400 a 499: la petición no era válida o no estaba permitida
    tipo: status >= 500 ? 'servidor' : 'cliente',
    estado: status,
    // El mensaje que envía DocuMind o, si no hay ninguno, uno genérico con el código
    mensaje: data?.error ?? `Error HTTP ${status}`,
    detalles
  }
}
