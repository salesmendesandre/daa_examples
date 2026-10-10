# 09 · Testing Automatizado con Vitest y Supertest

Proyecto de apoyo al capítulo **"Testing Automatizado con Vitest y Supertest"**. Scaffold igual
al del resto de capítulos: `src/server.ts` como punto de entrada (`app.listen`), `src/app.ts`
con la configuración de Express — con la particularidad de que `app` se exporta **sin** llamar a
`.listen()`, para que Supertest pueda levantar su propio servidor efímero en un puerto libre
aleatorio en cada test, sin colisionar con el `npm run dev` que sí escucha en el 3009 de verdad.
Sin base de datos (en memoria, para que los tests sean rápidos y no dependan de red).
Swagger UI en `http://localhost:3009/api/docs`.

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Documents`, `/api/documents`): la API sobre la que corre
  la suite de integración (`tests/integration/documents.api.test.ts`), recorriendo de verdad el
  pipeline **Zod → Middlewares → Controlador → Servicio → Respuesta HTTP**.
- **EJERCICIOS ya resueltos** (dominio `Tasks`, `/api/tasks`), corregidos en clase: los tests de
  `tests/exercises/` ya vienen resueltos y pasan en verde (12/12 tests en verde en total, junto a
  los 4 de Documents).
  - **Ejercicio 1** — `CreateTaskSchema`/`UpdateTaskSchema`: `title` obligatorio y `priority` en
    la whitelist `low`/`medium`/`high` (p. ej. `"urgent"` se rechaza con 400), también validado
    en el `PATCH` para que no se cuele por ahí lo que el `POST` rechaza.
  - **Ejercicio 2** — ciclo de vida completo de una tarea: Crear → Consultar → Modificar →
    Borrar → confirmar `404` tras el borrado.
  - **Ejercicio 3** — endpoint administrativo protegido con JWT (`GET /api/tasks/admin/metrics`):
    `401 Unauthorized` sin cabecera `Authorization`, `401 InvalidToken` con un token manipulado,
    y `200` con un token válido obtenido en `GET /api/tasks/admin/token-demo`.

## Estructura

Arquitectura en capas (`routes → controllers → services → models`), para que cada test de
integración recorra de verdad el pipeline: **Zod → Middlewares → Controlador → Servicio →
Respuesta HTTP**.

```
src/
├── server.ts                          → arranque (app.listen; NO se usa en los tests)
├── app.ts                             → app exportada sin listen + montaje de rutas
├── config/jwt.ts                      → EJERCICIOS (JWT_SECRET, soporte del Ejercicio 3)
├── controllers/
│   ├── documents.controller.ts        → CONTENIDO (GET/POST /api/documents)
│   └── tasks.controller.ts            → EJERCICIOS
├── docs/openapi.json                  → contrato OpenAPI (Documents + Tasks, bearerAuth)
├── errors/
│   ├── app.error.ts                   → HEREDADO (AppError)
│   └── auth.errors.ts                 → EJERCICIOS (401 Unauthorized / InvalidToken, Ejercicio 3)
├── middlewares/
│   ├── auth.middleware.ts             → EJERCICIOS (JWT, soporte del Ejercicio 3)
│   ├── error.middleware.ts            → HEREDADO (globalErrorHandler + 404)
│   └── validate.middleware.ts         → HEREDADO (validateBody con Zod)
├── models/
│   ├── document.store.ts              → CONTENIDO (Documents en memoria)
│   └── task.store.ts                  → EJERCICIOS (Tareas en memoria)
├── routes/
│   ├── documents.routes.ts            → CONTENIDO (/api/documents)
│   └── tasks.routes.ts                → EJERCICIOS (/api/tasks, incluye authenticateToken en /admin/metrics)
├── schemas/
│   ├── document.schema.ts             → CONTENIDO (título ≥ 3 caracteres + autor)
│   └── task.schema.ts                 → EJERCICIOS (Ejercicio 1: title/priority, PATCH del Ejercicio 2)
├── services/
│   ├── documents.service.ts           → CONTENIDO
│   ├── tasks.service.ts               → EJERCICIOS (404, métricas del Ejercicio 3)
│   └── token.service.ts               → EJERCICIOS (token de demo para el Ejercicio 3)
└── types/
    ├── document.types.ts              → CONTENIDO (DocumentItem)
    └── task.types.ts                  → EJERCICIOS (TaskItem)

tests/
├── integration/documents.api.test.ts  → CONTENIDO (suite de integración de Documents)
└── exercises/                         → EJERCICIOS ya resueltos (12/12 tests en verde)
    ├── ejercicio1_validacion.test.ts         → 400 si falta título / prioridad inválida (+ PATCH)
    ├── ejercicio2_ciclo_crud.test.ts         → ciclo completo Crear → Leer → Modificar → Borrar
    └── ejercicio3_endpoint_protegido.test.ts → 401 sin token / token manipulado / 200 con token válido
```

## Qué comprueba la suite de integración (CONTENIDO)

`tests/integration/documents.api.test.ts` recorre la API real con Supertest (sin mocks):

- `GET /api/documents` → `200` con la lista inicial de documentos.
- `POST /api/documents` con un título demasiado corto → `400` (`ValidationError`).
- `POST /api/documents` con payload válido → `201` con el documento creado.
- `GET /api/documents/:id` con un ID inexistente → `404`.

## Problemas que resuelve este código

1. **`app.listen` separado de `app.ts`**: `server.ts` es el único sitio donde se llama a
   `.listen()`, así que los tests pueden importar `app` sin levantar un puerto real.
2. **JSON mal formado y rutas inexistentes** devolvían páginas HTML de Express; ahora son
   respuestas JSON (`InvalidJSON` 400 y `NotFound` 404) gracias al `globalErrorHandler` heredado.
3. **`app.listen` en Express 5** recibe el error si el puerto está ocupado (`EADDRINUSE`); antes
   se anunciaba "escuchando" aunque el servidor no arrancara.
4. **(Ejercicio 1) El `PATCH` no validaba nada**: `{"priority": "urgent"}` se saltaba la
   validación del `POST` y `{"id": 999}` cambiaba el id de la tarea. Ahora pasa por
   `UpdateTaskSchema`, que valida los campos y descarta los no permitidos (`id`).

## Ejecución

```bash
npm install
npm run dev         # tsx watch src/server.ts -> http://localhost:3009 (para probar con curl/Thunder)
npm run typecheck
npm test            # Vitest + Supertest: 12 tests (4 de Documents + 8 de los 3 ejercicios)
npm run test:watch  # Vitest en modo watch
```

Para ejecutar solo los ejercicios resueltos:

```bash
npm test -- tests/exercises
```

## Probar en directo

```bash
curl http://localhost:3009/health

# --- Documents (CONTENIDO) ---

curl http://localhost:3009/api/documents

# Válido -> 201
curl -X POST http://localhost:3009/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Patrones de Diseño en TypeScript\",\"author\":\"Gang of Four\"}"

# Inválido (title demasiado corto) -> 400 con detalle de campo
curl -X POST http://localhost:3009/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hi\",\"author\":\"A\"}"

# ID inexistente -> 404
curl http://localhost:3009/api/documents/99999

# --- Tasks (EJERCICIOS, ya resueltos) ---

# Ejercicio 1 — sin título -> 400 (ValidationError, detalle en "details")
curl -X POST http://localhost:3009/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"priority\":\"medium\"}"

# Ejercicio 1 — prioridad fuera de la whitelist -> 400
curl -X POST http://localhost:3009/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Revisar arquitectura\",\"priority\":\"urgent\"}"

# Ejercicio 2 — ciclo CRUD completo:
# 1. Crear (201) -> anota el "id" de la respuesta
curl -X POST http://localhost:3009/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Configurar Vitest\",\"priority\":\"high\",\"dueDate\":\"2026-11-01\"}"

# 2. Consultar por id (200)
curl http://localhost:3009/api/tasks/1

# 3. Modificar (200, completed pasa a true)
curl -X PATCH http://localhost:3009/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"completed\":true}"

# 4. Borrar (204 sin cuerpo)
curl -i -X DELETE http://localhost:3009/api/tasks/1

# 5. Confirmar que ya no existe -> 404
curl http://localhost:3009/api/tasks/1

# Ejercicio 3 — endpoint protegido:

# Sin token -> 401 Unauthorized
curl -i http://localhost:3009/api/tasks/admin/metrics

# Token manipulado -> 401 InvalidToken
curl -i http://localhost:3009/api/tasks/admin/metrics \
  -H "Authorization: Bearer token_falso_manipulado"

# Token de demo válido -> 200 con las métricas
TOKEN=$(curl -s http://localhost:3009/api/tasks/admin/token-demo | sed -E 's/.*"token":"([^"]+)".*/\1/')
curl -i http://localhost:3009/api/tasks/admin/metrics \
  -H "Authorization: Bearer $TOKEN"
```

- **Swagger UI**: [http://localhost:3009/api/docs](http://localhost:3009/api/docs) (incluye
  `Tasks` con el esquema `bearerAuth`: pega el token de `/tasks/admin/token-demo` en "Authorize").
