# 05: Persistencia con MongoDB y Mongoose

Ejemplo correspondiente al **Capítulo 5: Persistencia con MongoDB y Mongoose**.

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Documents`, `/api/documents`): conexión a MongoDB con Mongoose, esquema con validaciones, capa de servicio y controlador con operaciones CRUD asíncronas.
- **EJERCICIOS ya resueltos** (dominio `Courses`, `/api/courses`), sobre el mismo patrón arquitectónico que `Documents`:
  - **Ejercicio 1** — Middleware `validateObjectId` que valida el formato de un `ObjectId` de MongoDB antes de tocar la base de datos, devolviendo `400 Bad Request` si no es válido.
  - **Ejercicio 2** — Subdocumentos anidados: cada curso tiene `lessons`, un array de subdocumentos con su propio esquema (`lessonSchema`) y `_id: false`.
  - **Ejercicio 3** — Borrado lógico (*Soft Delete*): `DELETE /api/courses/:id` no elimina el curso, lo archiva (`isArchived: true`) mediante un hook `pre(/^find/)` que oculta los archivados en cualquier consulta `find()` que no pregunte explícitamente por ellos.
  - El **Ejercicio 4** (filtrado avanzado con operadores de consulta) se deja sin resolver a propósito — es el que se construye en clase.

## Estructura

```
src/
├── server.ts                          → arranque: connectDB() + app.listen
├── app.ts                             → configuración de Express + montaje de rutas
├── config/database.ts                 → CONTENIDO (conexión a MongoDB)
├── models/
│   ├── document.model.ts              → CONTENIDO (esquema Documents)
│   └── course.model.ts                → EJERCICIOS (Ej.2 subdocumentos, Ej.3 hook soft delete)
├── services/
│   ├── documents.service.ts           → CONTENIDO (lógica de negocio de Documents)
│   └── courses.service.ts             → EJERCICIOS (lógica de negocio de Courses, incluido el soft delete)
├── controllers/
│   ├── documents.controller.ts        → CONTENIDO
│   └── courses.controller.ts          → EJERCICIOS
├── middlewares/validateObjectId.ts    → EJERCICIOS (Ej.1)
├── routes/
│   ├── documents.routes.ts            → CONTENIDO (/api/documents)
│   └── courses.routes.ts              → EJERCICIOS (/api/courses)
└── types/
    ├── document.types.ts              → tipos de entrada para Documents
    └── course.types.ts                → tipos de entrada para Courses
```

## Requisitos y Ejecución

Necesitas un MongoDB accesible, en cualquiera de estas dos formas:

1. **Mongo local**: instálalo en tu equipo, o levanta un contenedor rápido con `docker run -d -p 27017:27017 --name mongo-daa mongo`. Sin configurar nada más, el proyecto se conecta por defecto a `mongodb://localhost:27017/documind`.
2. **Tu propio clúster** (por ejemplo, un proyecto gratuito en MongoDB Atlas): copia `.env.example` como `.env` y ajusta `MONGODB_URI` con tu cadena de conexión. **No subas nunca tu `.env` a git** (ya está en `.gitignore`).

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3005
npm run typecheck
npm run build && npm start
```

## Probar en directo

```bash
curl http://localhost:3005/health

# --- Documents (CONTENIDO) ---
curl -X POST http://localhost:3005/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Mi primer documento\",\"content\":\"Contenido de prueba\",\"author\":\"Ada Lovelace\",\"tags\":[\"mongodb\"]}"

curl http://localhost:3005/api/documents
curl "http://localhost:3005/api/documents?tag=mongodb&status=draft"

# --- Courses (EJERCICIOS) ---
curl -X POST http://localhost:3005/api/courses \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"daa101\",\"title\":\"DAA\",\"credits\":6,\"instructor\":\"Ada Lovelace\",\"lessons\":[{\"title\":\"Intro\",\"durationMinutes\":60}]}"

curl http://localhost:3005/api/courses

# Ej.1 — ObjectId inválido -> 400 Bad Request:
curl http://localhost:3005/api/courses/123-abc

# Ej.3 — Soft delete: copia un _id real de una respuesta anterior y sustitúyelo aquí.
curl -X DELETE http://localhost:3005/api/courses/<ID_REAL>
curl http://localhost:3005/api/courses                    # ya no aparece
curl "http://localhost:3005/api/courses?isArchived=true"  # pero sigue existiendo, archivado
```
