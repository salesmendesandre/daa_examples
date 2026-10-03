# 09 · Testing Automatizado con Vitest y Supertest

Proyecto de apoyo al capítulo **"Testing Automatizado con Vitest y Supertest"**. Scaffold igual
al del resto de capítulos: `src/server.ts` como punto de entrada (`app.listen`), `src/app.ts`
con la configuración de Express — con la particularidad de que `app` se exporta **sin** llamar a
`.listen()`, para que Supertest pueda levantar su propio servidor efímero en un puerto libre
aleatorio en cada test, sin colisionar con el `npm run dev` que sí escucha en el 3009 de verdad.
Sin base de datos (en memoria, para que los tests sean rápidos y no dependan de red).
Swagger UI en `http://localhost:3009/api/docs`.

## Estructura

Arquitectura en capas (`routes → controllers → services → models`), para que el test de
integración recorra de verdad el pipeline: **Zod → Middlewares → Controlador → Servicio →
Respuesta HTTP**.

```
src/
├── server.ts                          → arranque (app.listen; NO se usa en los tests)
├── app.ts                             → app exportada sin listen + montaje de rutas
├── controllers/documents.controller.ts→ GET/POST /api/documents
├── docs/openapi.json                  → contrato OpenAPI
├── errors/app.error.ts                → heredado (AppError)
├── middlewares/
│   ├── error.middleware.ts            → heredado (globalErrorHandler + 404)
│   └── validate.middleware.ts         → heredado (validateBody con Zod)
├── models/document.store.ts           → Documents en memoria
├── routes/documents.routes.ts         → /api/documents
├── schemas/document.schema.ts         → título ≥ 3 caracteres + autor
├── services/documents.service.ts      → lógica de negocio de Documents
└── types/document.types.ts            → DocumentItem

tests/
└── integration/documents.api.test.ts  → suite de integración (Vitest + Supertest)
```

> Este capítulo aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Qué comprueba la suite de integración

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

## Ejecución

```bash
npm install
npm run dev         # tsx watch src/server.ts -> http://localhost:3009 (para probar con curl/Thunder)
npm run typecheck
npm test            # Vitest + Supertest: corre la suite de tests/integration
npm run test:watch  # Vitest en modo watch
```

## Probar en directo

```bash
curl http://localhost:3009/health

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
```

- **Swagger UI**: [http://localhost:3009/api/docs](http://localhost:3009/api/docs).
