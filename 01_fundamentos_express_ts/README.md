# 01: Fundamentos de APIs REST y Express 5 con TypeScript

Ejemplo correspondiente al **Capítulo 1: Fundamentos de APIs REST y Express 5 con TypeScript**.

## Conceptos Clave
- Creación de servidor HTTP moderno con **Express 5**.
- Tipado estricto con TypeScript para `Request`, `Response`, parámetros de ruta y cuerpos de petición (DTOs).
- Gestión nativa de Promesas y asincronía en Express 5.
- Endpoints REST en memoria: `GET /health`, `GET /api/documents`, `POST /api/documents`, `DELETE /api/documents/:id`.
- Filtro de búsqueda por query parameter: `GET /api/documents?tag=nodejs`.

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
```

## Pruebas con `curl`

```bash
# 1. Comprobar salud del servidor
curl http://localhost:3000/health

# 2. Obtener todos los documentos
curl http://localhost:3000/api/documents

# 3. Filtrar por etiqueta
curl http://localhost:3000/api/documents?tag=nodejs

# 4. Crear un nuevo documento
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo Doc","content":"Contenido de prueba","author":"Estudiante USAL","tags":["ia"]}'
```
