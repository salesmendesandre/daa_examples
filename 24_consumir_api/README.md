# Consumir la API REST desde Vue

Ejemplo del capítulo 24, **"Consumir la API REST desde Vue"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c24_consumir_api.html). Es la primera versión del frontend de **DocuMind**: listar, crear y borrar **notas** contra los endpoints públicos `/api/notes` de la API del curso, que no necesitan iniciar sesión.

## Qué repasar antes
- Vue Router (capítulo 20).
- Del bloque de APIs: métodos HTTP y códigos de estado (capítulo 2), validación con Zod (capítulo 4) y CORS (capítulo 6).
- Node.js 20+ y MongoDB.

## Qué incluye el ejemplo
Un proyecto de Vite con Vue, Vue Router y axios, **sin Vuetify**, para que todo el código nuevo sea el de la comunicación con la API:

- `.env.example` con `VITE_API_URL` y su lectura con `import.meta.env` en `src/api/client.js` (instancia de axios con `baseURL` y `timeout`).
- `src/api/notas.js`: una función por endpoint (`GET`, `POST` y `DELETE`); `src/api/errores.js`: normalización de errores (red, timeout, 4xx, 5xx) leyendo el cuerpo `{ error, details }` de DocuMind.
- `src/views/NotasView.vue` (ruta `/`): el listado con sus tres estados (`notas`, `error` y `cargando`) y un botón «Borrar» en cada nota.
- `src/views/NotaNuevaView.vue` (ruta `/nueva`): el formulario de alta. No valida en el cliente: si falta el título, se muestra el 400 de la API con el detalle del campo. Si la nota se crea, vuelve al listado.
- Editar una nota (`PATCH`) se deja como ejercicio, en una vista propia.

## Cómo ejecutar

0. Si no tienes el repositorio de ejemplos, clónalo con `git clone https://github.com/salesmendesandre/daa_examples.git` y entra en su carpeta (`cd daa_examples`). Si ya lo tenías, ejecuta `git pull` para traer los últimos cambios: las notas se han añadido a DocuMind para este capítulo.

1. Arranca el backend DocuMind (una sola vez para todos los capítulos de Vue que consumen la API). Necesita una base de datos MongoDB; en clase se usa **MongoDB Atlas**. Desde la raíz del repositorio de ejemplos:

   ```bash
   cd backend_documind
   cp .env.example .env
   # En .env, pon en MONGODB_URI la cadena de conexión de Atlas con documind_db como base de datos:
   # MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/documind_db?retryWrites=true&w=majority
   npm install
   npm run dev                   # API en http://localhost:3013/api
   ```

   La primera vez carga datos de demostración, entre ellos 5 notas. `npm run seed` los restablece.

2. En otra terminal, arranca este frontend:

   ```bash
   cd 24_consumir_api
   cp .env.example .env
   npm install
   npm run dev
   ```

Abre `http://localhost:5173`. Para ver el manejo de errores, ve a «Nueva nota» y pulsa «Añadir» con el título vacío (400) o detén el backend y recarga la página (error de red).
