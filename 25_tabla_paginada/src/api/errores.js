// Convierte el error de una petición en un objeto fácil de mostrar:
// { tipo, estado, mensaje, detalles }
export function normalizarError(error) {
  // Sin respuesta: la API está apagada, la URL es incorrecta o se ha agotado el timeout
  if (!error.response) {
    const mensaje =
      error.code === 'ECONNABORTED'
        ? 'La API ha tardado demasiado en responder.'
        : 'No se pudo conectar con la API. ¿Está DocuMind arrancado?'
    return { tipo: 'red', estado: null, mensaje, detalles: [] }
  }

  // Con respuesta: DocuMind envía { error } y, en los errores de validación (400), también details
  const { status, data } = error.response
  return {
    tipo: status >= 500 ? 'servidor' : 'cliente', // 5xx: falla la API; 4xx: la petición no es válida
    estado: status,
    mensaje: data?.error ?? `Error HTTP ${status}`,
    detalles: (data?.details ?? []).map((d) => ({ campo: d.field ?? d.param, mensaje: d.message }))
  }
}
