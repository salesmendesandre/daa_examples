# Backend DocuMind — API del curso

Proyecto final integrador del bloque de APIs de la asignatura **Desarrollo de Aplicaciones Avanzadas (DAA)** y **backend común del bloque de Vue**: los capítulos que consumen una API (c23 en adelante) trabajan contra este servidor, que se arranca una sola vez.

Esta aplicación combina todos los módulos y patrones aprendidos a lo largo del curso en una API REST robusta, tipada, segura, observable y preparada para producción.

---

## 🏗️ Arquitectura y Tecnologías Integradas

1. **Framework y Lenguaje:** Node.js 20+, Express 5, TypeScript 5 (modo ESM nativo con `NodeNext`).
2. **Validación de Esquemas:** Zod 4 para cuerpos de petición (`RegisterSchema`, `CreateDocumentSchema`) y parámetros de consulta (`DocumentQuerySchema`, `RagQuerySchema`).
3. **Persistencia NoSQL:** MongoDB 7+ con Mongoose 8+, esquemas fuertemente tipados (`InferSchemaType`) e índices compuestos de texto y etiquetas.
4. **Seguridad Defensiva (Hardening):**
   - Helmet (cabeceras seguras CSP, HSTS, X-Frame-Options).
   - CORS parametrizado.
   - Rate Limiting (`express-rate-limit`).
   - Cifrado de contraseñas con `bcrypt` (salt rounds = 10).
   - Autenticación JWT con esquema Bearer y autorización por roles (RBAC: `user` y `admin`).
5. **Ingesta y Procesamiento Documental:**
   - Middleware Multer para recepción de archivos `multipart/form-data`.
   - Extracción de contenido de archivos PDF mediante `pdf-parse`.
6. **Búsqueda Híbrida y RAG:**
   - Búsqueda léxica tradicional con `$text`.
   - Búsqueda semántica con cálculo de similitud coseno vectorial.
   - Endpoint de preguntas y respuestas RAG (`/api/rag/query`) con inyección de contexto documental en prompts.
   - Versión en streaming (`/api/rag/stream`, Server-Sent Events) que envía las fuentes y después la respuesta token a token.
7. **Tiempo real:** Socket.IO en el mismo puerto que la API, con autenticación JWT en el handshake, avisos de cambios en documentos, chat y lista de usuarios conectados.
8. **Observabilidad:** Logging estructurado JSON de alto rendimiento con `pino` y `pino-http`.
9. **Documentación Viva:** OpenAPI 3.0 con Swagger UI accesible en `/api/docs`.
10. **Testing Automatizado:** Suite de pruebas con Vitest, Supertest y `socket.io-client` (`tests/`).

---

## 🚀 Puesta en Marcha

### 1. Iniciar MongoDB

Igual que en el capítulo de Persistencia: instala MongoDB localmente o levanta un contenedor rápido con:
```bash
docker run -d -p 27017:27017 --name mongo-daa mongo
```

### 2. Configurar, instalar y ejecutar

```bash
cp .env.example .env
npm install
npm run dev
```

El servidor arrancará en `http://localhost:3013`:
- **Documentación Swagger UI:** [http://localhost:3013/api/docs](http://localhost:3013/api/docs)
- **Salud del servicio:** [http://localhost:3013/health](http://localhost:3013/health)

### 3. Datos de demostración

La primera vez que arranca con la base de datos vacía, el servidor carga **3 usuarios y 14 documentos** de ejemplo (`src/data/seed.ts`), suficientes para probar la paginación, los filtros y los permisos. Para desactivarlo, pon `SEED_DEMO_DATA=false` en `.env`. Para volver al estado inicial en cualquier momento:

```bash
npm run seed
```

Usuarios de demostración (**solo para desarrollo local**):

| Email | Contraseña | Rol |
|---|---|---|
| `admin@documind.test` | `Admin1234!` | admin |
| `ana@documind.test` | `Ana12345!` | user |
| `luis@documind.test` | `Luis12345!` | user |

Un usuario solo puede editar o borrar sus propios documentos; el administrador, todos.

### 4. Ejecutar las pruebas automáticas

```bash
npm test
```

---

## 🔌 Uso desde el frontend de Vue

- **CORS:** por defecto se admiten `http://localhost:5173` y `http://127.0.0.1:5173` (servidor de desarrollo de Vite). Si tu app usa otro origen, añádelo a `CORS_ORIGIN` en `.env` (separados por comas).
- **Autenticación:** `POST /api/auth/login` devuelve un `token`; envíalo en cada petición protegida con la cabecera `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Registro (devuelve token) |
| `POST` | `/api/auth/login` | — | Inicio de sesión (devuelve token) |
| `GET` | `/api/auth/me` | Bearer | Perfil del usuario autenticado |
| `GET` | `/api/documents?page=&limit=&sort=&tag=&status=` | — | Listado paginado con filtros y metadatos (`meta`) |
| `GET` | `/api/documents/:id` | — | Detalle de un documento |
| `POST` | `/api/documents` | Bearer | Crear documento |
| `PATCH` | `/api/documents/:id` | Bearer (autor o admin) | Actualizar parcialmente (`title`, `content`, `tags`, `status`) |
| `DELETE` | `/api/documents/:id` | Bearer (autor o admin) | Eliminar documento |
| `POST` | `/api/documents/upload-pdf` | Bearer | Subir un PDF (`multipart/form-data`, campo `file`) |
| `GET` | `/api/documents/search/text?q=` | — | Búsqueda léxica |
| `POST` | `/api/documents/search/semantic` | — | Búsqueda semántica |
| `POST` | `/api/rag/query` | — | Pregunta RAG sobre los documentos (respuesta JSON completa) |
| `POST` | `/api/rag/stream` | Bearer | Pregunta RAG con respuesta en streaming (`text/event-stream`) |

### Streaming RAG: `POST /api/rag/stream`

Mismo cuerpo que `/api/rag/query` (`{ "question": "...", "topK": 3 }`), pero la respuesta es un flujo de [Server-Sent Events](https://developer.mozilla.org/es/docs/Web/API/Server-sent_events/Using_server-sent_events) sobre un `POST`, que se consume con `fetch` y `response.body.getReader()` (no con `EventSource`, que solo admite `GET` sin cabeceras):

| Evento | Datos | Cuándo |
|---|---|---|
| `sources` | `{ context: [{ documentId, title, snippet, similarity }] }` | Primero, al terminar la recuperación |
| `token` | `{ text }` | Uno por fragmento de la respuesta |
| `done` | `{ answer, simulated: true }` | Al final; después se cierra la respuesta |
| `error` | `{ error }` | Si algo falla con el stream ya empezado |

La **generación es simulada**: compone el texto a partir de las fuentes. Toda la generación está en `generateAnswerStream()` (`src/services/rag.service.ts`), la única función que habría que sustituir por la llamada en streaming a un LLM real. El retardo entre tokens se ajusta con `RAG_STREAM_DELAY_MS` (40 ms por defecto). Si el cliente cierra la conexión, la generación se detiene.

---

## ⚡ Tiempo real con Socket.IO

Socket.IO comparte el servidor HTTP (y el puerto 3013) con Express; la ruta interna es `/socket.io`. Admite los mismos orígenes que `CORS_ORIGIN`.

**Autenticación:** el cliente envía el JWT en el handshake y el servidor lo verifica con la misma función que el middleware REST (`verifyToken`). Sin token, o con uno inválido o caducado, la conexión se rechaza con un `connect_error` cuyo mensaje empieza por `unauthorized`. Si el token caduca con la conexión abierta, el servidor la cierra.

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:3013", { auth: { token } });
```

| Evento | Sentido | Datos |
|---|---|---|
| `documents:created` | servidor → clientes | `{ id, title, authorName, status, by: { userId, fullName }, at }` |
| `documents:updated` | servidor → clientes | igual que el anterior |
| `documents:deleted` | servidor → clientes | igual que el anterior |
| `presence:list` | servidor → clientes | `[{ id, fullName }]` usuarios conectados (sin duplicar pestañas) |
| `chat:history` | servidor → cliente que conecta | Últimos 50 mensajes (en memoria) |
| `chat:message` | cliente → servidor | `{ text }` (1-500 caracteres) con *acknowledgement* `{ ok: true, message }` o `{ ok: false, error }` |
| `chat:message` | servidor → clientes | `{ id, text, user: { id, fullName }, at }` |

Los eventos de documentos se emiten solo después de que la operación REST termine con éxito (crear, subir PDF, actualizar y borrar), desde `src/realtime/events.ts`, que no hace nada si Socket.IO no está iniciado (por ejemplo, en los tests con Supertest). El autor de cada mensaje y su hora los pone el servidor a partir del JWT: un cliente no puede hacerse pasar por otro.
