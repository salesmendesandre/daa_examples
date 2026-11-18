const formateadorFecha = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

export function formatearFecha(iso) {
  return iso ? formateadorFecha.format(new Date(iso)) : '—'
}

// color: uno de los colores del tema de Vuetify
export const ESTADOS = [
  { valor: 'draft', etiqueta: 'Borrador', color: 'warning' },
  { valor: 'published', etiqueta: 'Publicado', color: 'success' },
  { valor: 'archived', etiqueta: 'Archivado', color: 'grey' }
]

export function infoEstado(valor) {
  return ESTADOS.find((e) => e.valor === valor) ?? { valor, etiqueta: valor, color: 'info' }
}
