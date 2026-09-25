# 01: Fundamentos de APIs REST y Express 5 con TypeScript

Ejemplo correspondiente al **Capítulo 1: Fundamentos de APIs REST y Express 5 con TypeScript**.
Incluye tanto el contenido explicado en clase como los ejercicios prácticos ya resueltos.

## Estructura

- `src/server.ts`: arranque del servidor (`app.listen`).
- `src/app.ts`: configuración de la aplicación Express (middlewares y montaje de routers).
- `src/types.ts`: tipos compartidos (`DocumentItem`, `CreateDocumentDTO`, `ProductItem`).
- `src/routes/documents.routes.ts` — **CONTENIDO**: CRUD de documentos en memoria.
  - `GET /api/documents` (con filtro opcional `?tag=...`)
  - `GET /api/documents/:id`
  - `POST /api/documents`
  - `DELETE /api/documents/:id`
- `src/routes/products.routes.ts` — **EJERCICIOS RESUELTOS**: catálogo de productos.
  - Ejercicio 1 · `GET /api/products`: filtrado combinado por `category`, `maxPrice` e
    `inStock` (query params opcionales, combinables entre sí).
  - Ejercicio 2 · `GET /api/products/stats`: estadísticas agregadas (total de productos,
    stock total, precio medio y conteo por categoría). Declarado antes de cualquier
    ruta `/:id` para que Express no confunda `stats` con un identificador.
  - Ejercicio 3 · `POST /api/products`: validación manual de tipos y rangos, respuesta
    `201 Created` con cabecera `Location` apuntando al recurso creado.

## Conceptos clave

- Creación de servidor HTTP moderno con **Express 5**, separando `server.ts` (arranque)
  de `app.ts` (configuración).
- Tipado estricto con TypeScript para `Request`, `Response`, parámetros de ruta y
  cuerpos de petición (DTOs).
- Verbos HTTP y su semántica (GET/POST/DELETE) + idempotencia.
- Diferencia entre parámetro de ruta (`:id`) y query parameter (`?tag=...`).
- Códigos de estado: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `204 No Content`.

## Ejecución

```bash
# Instalar dependencias (desde este directorio o desde la raíz del repo):
npm install

# Modo desarrollo con recarga automática:
npm run dev

# Comprobar tipado estricto con TypeScript:
npm run typecheck

# Compilar a JavaScript:
npm run build
npm start
```

## Pruebas con `curl`

### Contenido: Documents

```bash
# Comprobar salud del servidor
curl http://localhost:3000/health

# Obtener todos los documentos
curl http://localhost:3000/api/documents

# Filtrar por etiqueta
curl http://localhost:3000/api/documents?tag=nodejs

# Crear un nuevo documento
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo Doc","content":"Contenido de prueba","author":"Estudiante USAL","tags":["ia"]}'

# Eliminar un documento
curl -X DELETE http://localhost:3000/api/documents/1
```

### Ejercicios: Products

```bash
# Listar productos con filtrado combinado
curl "http://localhost:3000/api/products?category=perifericos&maxPrice=100&inStock=true"

# Estadísticas del catálogo
curl http://localhost:3000/api/products/stats

# Crear un producto (201 Created + cabecera Location)
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam HD","category":"perifericos","price":39.99,"stock":10}'
```
