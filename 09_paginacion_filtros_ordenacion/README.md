# 09 · Paginación, Filtrado Dinámico y Ordenación

Proyecto de apoyo al capítulo **"Paginación, Filtrado Dinámico y Ordenación"**. Scaffold igual
al del resto de capítulos: `src/server.ts` como punto de entrada (`connectDB()` + `seedData()` +
`app.listen`), `src/app.ts` con la configuración de Express. Puerto 3006. Conectado a MongoDB
con Mongoose. Swagger UI en `http://localhost:3006/api/docs`.

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Documents`, `/api/documents`): paginación offset con
  `Promise.all`, whitelist de ordenación y filtrado por tag/búsqueda.
- **EJERCICIOS ya resueltos** (dominio `Catalog`, `/api/catalog`), catálogo e-commerce sobre el
  mismo patrón arquitectónico que `Documents`:
  - **Ejercicio 1** — `CatalogQuerySchema`: validación Zod del query string con
    `z.coerce.number()` para `page`/`limit`/`minPrice`/`maxPrice`, whitelist de ordenación
    (`CATALOG_SORT_FIELDS`) y un `.refine()` cruzado para que `minPrice <= maxPrice`.
  - **Ejercicio 2** — `buildMongoCatalogFilter`: filtros dinámicos `$gte`/`$lte` (precio) y
    `$in` (`category`/`brand` con varios valores separados por comas), con `brand` escapado
    y comparado de forma exacta e insensible a mayúsculas.
  - **Ejercicio 3** — `buildPaginationLinks`: enlaces HATEOAS (`first`/`prev`/`next`/`last`)
    construidos con la API nativa `URL`, que conservan el resto de filtros de la petición
    original (`category`, `brand`, etc.) en vez de perderlos.

## Estructura

```
src/
├── server.ts                            → arranque: connectDB() + seedData() + app.listen
├── app.ts                               → montaje de rutas (Documents + Catalog) + Swagger + manejador de errores
├── config/database.ts                   → conexión a MongoDB
├── controllers/
│   ├── documents.controller.ts          → CONTENIDO (GET /api/documents)
│   └── catalog.controller.ts            → EJERCICIOS (GET /api/catalog)
├── data/seed.ts                         → 15 documentos + 24 productos de catálogo (idempotente)
├── docs/openapi.json                    → contrato OpenAPI (Documents + Catalog)
├── errors/app.error.ts                  → HEREDADO (AppError)
├── middlewares/
│   ├── error.middleware.ts              → HEREDADO (globalErrorHandler + 404)
│   └── validate.middleware.ts           → HEREDADO: validateQuery (arreglado para Express 5)
├── models/
│   ├── document.model.ts                → CONTENIDO (esquema Mongoose de Documents)
│   └── catalogProduct.model.ts          → EJERCICIOS (esquema Mongoose de CatalogProduct)
├── routes/
│   ├── documents.routes.ts              → CONTENIDO (/api/documents)
│   └── catalog.routes.ts                → EJERCICIOS (/api/catalog)
├── schemas/
│   ├── document.schema.ts               → CONTENIDO (rechaza parámetros repetidos ?tag=a&tag=b)
│   └── catalog.schema.ts                → EJERCICIOS (Ej.1: Zod + coerce + whitelist de ordenación)
├── services/
│   ├── pagination.service.ts            → CONTENIDO (Promise.all datos+conteo, whitelist de ordenación)
│   ├── catalog.service.ts               → EJERCICIOS (orquesta Ej.1 validación + Ej.2 filtro + Ej.3 enlaces)
│   ├── catalogFilter.service.ts         → EJERCICIOS (Ej.2: filtros dinámicos $gte/$lte/$in)
│   └── hateoas.service.ts               → EJERCICIOS (Ej.3: enlaces HATEOAS first/prev/next/last)
├── types/pagination.types.ts            → CONTENIDO (PaginationOptions/Meta/Result) + EJERCICIOS (Ej.3: HateoasLinks/PaginatedResultWithLinks)
└── utils/escapeRegex.ts                 → HEREDADO: función pura, escapa el texto del cliente antes de un $regex
```

## Problemas que resuelve este código

**Documents (CONTENIDO):**

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

**Catalog (EJERCICIOS) — huecos encontrados y corregidos sobre la solución base del libro:**

1. **Ordenación sin lista blanca**: el enunciado pide listas blancas (como `ALLOWED_SORT_FIELDS`
   del punto 3), pero la solución inicial aceptaba cualquier `sort`: `?sort=-campoInventado` se
   ejecutaba sin más y `?sort=` o `?sort=$where` hacían fallar MongoDB (500). Ahora
   `CATALOG_SORT_FIELDS` limita los campos permitidos.
2. **Faltaba `$in`**: el enunciado pide `$gte`, `$lte` **e `$in`**, pero la solución no lo usaba:
   `?category=calzado,ropa` devolvía 0 productos. Ahora varios valores separados por comas se
   traducen a `{ $in: [...] }` tanto en `category` como en `brand`.
3. **`brand` sin escapar en un `$regex`**: `?brand=[` daba 500 y `?brand=.*` devolvía todas las
   marcas. Ahora cada marca se escapa (`utils/escapeRegex.ts`) y se busca de forma exacta e
   insensible a mayúsculas (`^nike$` con la opción `i`).

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

# --- Documents (CONTENIDO) ---

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

# --- Catalog (EJERCICIOS) ---

# Página por defecto (page=1, limit=12, orden por createdAt desc, solo productos en stock)
curl "http://localhost:3006/api/catalog"

# Ej.2 — Filtro de rango de precio ($gte/$lte)
curl "http://localhost:3006/api/catalog?minPrice=20&maxPrice=80"

# Ej.2 — Varias categorías/marcas separadas por comas ($in)
curl "http://localhost:3006/api/catalog?category=calzado,ropa&brand=Nike,Adidas"

# Ordenación por precio ascendente (whitelist: createdAt, price, rating, name)
curl "http://localhost:3006/api/catalog?sort=price"

# Ej.1 — minPrice > maxPrice -> 400 (Zod .refine())
curl "http://localhost:3006/api/catalog?minPrice=100&maxPrice=10"

# Ej.1 — Campo de ordenación no permitido -> 400 (a diferencia de Documents, aquí se rechaza)
curl "http://localhost:3006/api/catalog?sort=-campoInventado"

# Ej.3 — Enlaces HATEOAS: pide la página 2 con un filtro y observa "links.first/prev/next/last"
# conservando "category" en cada URL generada
curl "http://localhost:3006/api/catalog?category=calzado&page=2&limit=5"
```

- **Swagger UI**: [http://localhost:3006/api/docs](http://localhost:3006/api/docs).
