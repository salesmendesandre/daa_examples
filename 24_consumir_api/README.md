# Consumir la API REST desde Vue

Ejemplo del capítulo 24, **"Consumir la API REST desde Vue"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c24_consumir_api.html). Es la primera versión del frontend de **DocuMind**: la parte de solo lectura (listado y detalle), que usa los endpoints públicos `GET` de la API del curso.

## Qué repasar antes
- Composables y el patrón `useFetch` (capítulo 19), Vue Router (capítulo 20) y Vuetify (capítulo 22).
- Del bloque de APIs: CORS (capítulo 6) y paginación con metadatos (capítulo 9).
- Node.js 20+ y Docker (para MongoDB).

## Qué incluye el ejemplo
- `.env.example` con `VITE_API_URL` y su lectura con `import.meta.env` en `src/api/client.js` (instancia de axios con `baseURL` y `timeout`).
- `src/api/documents.js`: servicio con las llamadas a la API; `src/api/errores.js`: normalización de errores (red, timeout, 4xx, 5xx) leyendo el cuerpo `{ error, details }` de DocuMind.
- `src/composables/useApi.js`: evolución de `useFetch` para axios con `cargando`, `error` y `recargar`.
- `DocumentosView.vue`: lista (`v-list`) con la primera página de documentos, esqueleto de carga y mensaje de error.
- `DocumentoDetalleView.vue`: detalle por parámetro de ruta, con mensajes para 400/404 y errores de red.

## Cómo ejecutar

1. Arranca el backend DocuMind (una sola vez para todos los capítulos de Vue que consumen la API). Necesita MongoDB en el puerto 27017, instalado como se explica en la configuración del equipo (servicio local, contenedor Docker `mongodb-dev` o Atlas cambiando `MONGODB_URI` en el `.env`). Desde la raíz del repositorio de ejemplos:

   ```bash
   docker start mongodb-dev      # solo si MongoDB se instaló con Docker
   cd backend_documind
   cp .env.example .env
   npm install
   npm run dev                   # API en http://localhost:3013/api
   ```

   La primera vez carga datos de demostración (3 usuarios y 14 documentos). `npm run seed` los restablece.

2. En otra terminal, arranca este frontend:

   ```bash
   cd 24_consumir_api
   cp .env.example .env
   npm install
   npm run dev
   ```

Abre `http://localhost:5173`. Pulsa un documento para ver su detalle. Para ver el manejo de errores, detén el backend y recarga la página, o abre `http://localhost:5173/documentos/no-es-un-id`.
