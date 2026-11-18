import { apiClient } from './client'

// Servicio de documentos: cada función conoce una ruta de la API y devuelve
// directamente los datos (response.data), de modo que las vistas no ven axios.

/**
 * GET /documents con paginación y orden (capítulo 9).
 * Devuelve { data: Documento[], meta: { total, page, limit, totalPages, hasNextPage, hasPrevPage } }.
 */
export async function listarDocumentos(params = {}) {
  const { data } = await apiClient.get('/documents', { params })
  return data
}

/** GET /documents/:id */
export async function obtenerDocumento(id) {
  const { data } = await apiClient.get(`/documents/${id}`)
  return data
}
