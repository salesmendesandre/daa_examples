# 05 · Documentación de APIs con OpenAPI y Swagger UI

Proyecto de apoyo al capítulo **"Documentación de APIs con OpenAPI y Swagger UI"**. Scaffold
igual al del resto de capítulos: `src/server.ts` como punto de entrada, `src/app.ts` con la
configuración de Express.

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Documents`, `/api/documents`): especificación OpenAPI
  formal servida con Swagger UI en `/api/docs`.
- **EJERCICIOS ya resueltos** (dominio `Books`, `/api/books`), con una implementación real que
  cumple exactamente lo que documenta `docs/openapi.json`:
  - **Ejercicio 1** — `GET /books/{isbn}`: devuelve `200` con el libro o `404` (vía `AppError`)
    si el ISBN no existe en el catálogo.
  - **Ejercicio 2** — Esquemas `Book` y `CreateBookPayload` en `components.schemas`, reforzados
    en el servidor real con `book.schema.ts` (Zod) para que el contrato documentado se cumpla.
  - **Ejercicio 3** — `securitySchemes.bearerAuth` (JWT) aplicado a `POST /books`: en Swagger UI
    aparece el botón **Authorize** 🔒, y el servidor lo hace cumplir con `requireBearerToken`.

## Estructura

```
src/
├── server.ts                          → arranque del servidor
├── app.ts                             → configuración de Express + montaje de rutas
├── docs/openapi.json                  → especificación OpenAPI 3.0 (Documents + Books + bearerAuth)
├── schemas/book.schema.ts             → EJERCICIOS (Ej.2: CreateBookSchema con Zod)
├── middlewares/
│   ├── validate.middleware.ts         → validateBody genérico (ver capítulo 4)
│   ├── error.middleware.ts            → notFoundHandler + globalErrorHandler (ver capítulo 4)
│   └── requireBearerToken.ts          → EJERCICIOS (Ej.3: candado Authorize de Swagger UI)
├── errors/app.error.ts                → clase base AppError (ver capítulo 4)
├── models/book.store.ts               → EJERCICIOS (catálogo de libros en memoria)
├── services/books.service.ts          → EJERCICIOS (Ej.1: 404 si no existe el ISBN)
├── controllers/books.controller.ts    → EJERCICIOS
├── routes/books.routes.ts             → EJERCICIOS (/api/books)
└── types/book.types.ts                → tipos de BookItem
```

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3004
npm run typecheck
npm run build && npm start
```

## Probar en directo

- **Swagger UI**: [http://localhost:3004/api/docs](http://localhost:3004/api/docs) — consola
  interactiva generada a partir de `docs/openapi.json`, con botón "Try it out" y, en
  `POST /books`, el candado **Authorize** 🔒 (Ejercicio 3).

```bash
# --- Documents (CONTENIDO) ---
curl http://localhost:3004/api/documents

# --- Books (EJERCICIOS) ---
curl http://localhost:3004/api/books

# Ej.1 — ISBN existente -> 200
curl http://localhost:3004/api/books/978-0132350884

# Ej.1 — ISBN inexistente -> 404
curl http://localhost:3004/api/books/000-0000000000

# Ej.3 — Sin token -> 401
curl -X POST http://localhost:3004/api/books \
  -H "Content-Type: application/json" \
  -d "{\"isbn\":\"978-0134685991\",\"title\":\"Effective Java\",\"authors\":[\"Joshua Bloch\"],\"publishedYear\":2018}"

# Ej.2 + Ej.3 — Con token Bearer (cualquier valor no vacío) -> 201
curl -X POST http://localhost:3004/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d "{\"isbn\":\"978-0134685991\",\"title\":\"Effective Java\",\"authors\":[\"Joshua Bloch\"],\"publishedYear\":2018}"
```
