# Listados paginados

Ejemplo del capítulo 25, **"Listados paginados"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c25_tabla_paginada.html). Reutiliza la base de `24_consumir_api` (cliente axios y `normalizarError`) y pasa de las notas a los **documentos** de DocuMind: una tabla de Vuetify paginada y ordenada en el servidor y la vista de detalle.

## Qué repasar antes
- El ejemplo `24_consumir_api`: cliente axios, servicios y `normalizarError`.
- Del bloque de APIs: CORS (capítulo 6) y paginación con metadatos (capítulo 9).
- Node.js 20+ y Docker (para MongoDB).

## Qué incluye el ejemplo
- `DocumentosView.vue`: `v-data-table-server` con `v-model:page`, `v-model:items-per-page` y `v-model:sort-by`; un `computed` traduce esos valores a los parámetros `page`, `limit` y `sort` de DocuMind y un `watch` repite la petición cuando cambian.
- `src/composables/useAvisos.js`: cola de avisos de toda la aplicación, que `App.vue` muestra con `v-snackbar-queue`. El listado la usa si falla la carga de otra página.
- `src/api/documents.js`: servicio de documentos (`GET /documents` con parámetros y `GET /documents/:id`).
- `DocumentoDetalleView.vue`: detalle por parámetro de ruta, con mensajes para 400/404 y errores de red.
- `EstadoDocumento.vue` y `src/utils/formato.js`: etiqueta de color para el estado y formato de fechas.
- El cliente axios y `errores.js` son los de `24_consumir_api`.

## Cómo ejecutar

1. Arranca el backend DocuMind como se explica en `24_consumir_api/README.md`.

2. En otra terminal, arranca este frontend:

   ```bash
   cd 25_tabla_paginada
   cp .env.example .env
   npm install
   npm run dev
   ```

Abre `http://localhost:5173`. Prueba a cambiar de página, de filas por página y a ordenar por columnas, y mira en la pestaña *Network* qué parámetros recibe `GET /api/documents`. Para ver el aviso, detén el backend con la tabla ya cargada y cambia de página.
