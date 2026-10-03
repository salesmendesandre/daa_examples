# 06 · Paginación, Filtrado Dinámico y Ordenación

Proyecto de apoyo al capítulo **"Paginación, Filtrado Dinámico y Ordenación"**. Scaffold igual
al del resto de capítulos: `src/server.ts` como punto de entrada (`connectDB()` + `seedData()` +
`app.listen`), `src/app.ts` con la configuración de Express. Puerto 3006. Conectado a MongoDB
con Mongoose. Swagger UI en `http://localhost:3006/api/docs`.

## Estructura

```
src/
├── server.ts                          → arranque: connectDB() + seedData() + app.listen
├── app.ts                             → montaje de rutas + Swagger + manejador de errores
├── config/database.ts                 → conexión a MongoDB
├── controllers/documents.controller.ts→ GET /api/documents
├── data/seed.ts                       → 15 documentos de demo (idempotente)
├── docs/openapi.json                  → contrato OpenAPI con los parámetros de query
├── errors/app.error.ts                → heredado (AppError)
├── middlewares/
│   ├── error.middleware.ts            → heredado (globalErrorHandler + 404)
│   └── validate.middleware.ts         → heredado: validateQuery (arreglado para Express 5)
├── models/document.model.ts           → esquema Mongoose de Documents
├── routes/documents.routes.ts         → /api/documents
├── schemas/document.schema.ts         → rechaza parámetros repetidos (?tag=a&tag=b)
├── services/pagination.service.ts     → Promise.all datos+conteo, whitelist de ordenación
├── types/pagination.types.ts          → PaginationOptions/Meta/Result
└── utils/escapeRegex.ts               → función pura: escapa el texto del cliente antes de un $regex
```

> Este capítulo aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Problemas que resuelve este código

1. **Parámetros repetidos** (`?tag=a&tag=b`, `?sort=a&sort=b`) llegan como array y el servicio
   reventaba con 500 (`toLowerCase is not a function`). Ahora `DocumentsQuerySchema` responde 400.
2. **`validateQuery` no funciona tal cual en Express 5** (`req.query` es de solo lectura y la
   asignación se ignoraba): corregido en `middlewares/validate.middleware.ts` redefiniendo la
   propiedad con `Object.defineProperty`.
3. **Texto del cliente sin escapar en `$regex`** (parámetro `search`): `?search=[` daba 500 y
   `?search=.*` devolvía todos los documentos. Ahora se escapa (`utils/escapeRegex.ts`).
4. **Ordenación sin lista blanca**: sin `ALLOWED_SORT_FIELDS`, un cliente podría forzar
   `?sort=passwordHash` sobre un campo no indexado o sensible.
5. **Errores con traza al cliente**: sin manejador de errores, los fallos de MongoDB devolvían
   una página HTML con el stack trace y las rutas del servidor. Ahora es un JSON genérico.
6. **`totalPages` = 0 sin resultados**: el enlace `last` apuntaría a la página 0. Se usa `|| 1`.
7. **`app.listen` en Express 5** recibe el error si el puerto está ocupado (`EADDRINUSE`); antes
   se anunciaba "escuchando" aunque el servidor no arrancara.

## Requisitos y ejecución

Necesitas un MongoDB accesible, en cualquiera de estas dos formas:

1. **Mongo local**: instálalo en tu equipo, o levanta un contenedor rápido con
   `docker run -d -p 27017:27017 --name mongo-daa mongo`. Sin configurar nada más, el proyecto
   se conecta por defecto a `mongodb://localhost:27017/documind`.
2. **Tu propio clúster** (por ejemplo, un proyecto gratuito en MongoDB Atlas): copia
   `.env.example` como `.env` y ajusta `MONGODB_URI` con tu cadena de conexión. **No subas nunca
   tu `.env` a git** (ya está en `.gitignore`).

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3006 (siembra datos si faltan)
npm run typecheck
npm run build && npm start
```

## Probar en directo

```bash
curl http://localhost:3006/health

# Página por defecto (page=1, limit=10, orden por createdAt desc)
curl http://localhost:3006/api/documents

# Paginación + ordenación ascendente por título + filtro por tag
curl "http://localhost:3006/api/documents?page=1&limit=5&sort=title&tag=nodejs"

# Búsqueda por título (insensible a mayúsculas)
curl "http://localhost:3006/api/documents?search=t%C3%A9cnico"

# Parámetro repetido -> 400 (ValidationError)
curl "http://localhost:3006/api/documents?tag=nodejs&tag=api"

# Campo de ordenación no permitido -> se ignora (usa createdAt por defecto)
curl "http://localhost:3006/api/documents?sort=passwordHash"
```

- **Swagger UI**: [http://localhost:3006/api/docs](http://localhost:3006/api/docs).
