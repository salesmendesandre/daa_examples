# 02: Diseño REST y Arquitectura en Capas

Ejemplo correspondiente al **Capítulo 2: Diseño de APIs REST y Arquitectura de Software**.

Arquitectura en tres capas (rutas → controladores → servicios → modelos), con respuestas en
formato **JSend** (`{status: "success", data}` / `{status: "fail", message}`) y `PATCH` para
actualizaciones parciales (no `PUT`).

## Qué es CONTENIDO y qué son EJERCICIOS

El dominio **Documents** es el CONTENIDO explicado en clase. El dominio **Tickets** son los
ejercicios de la sesión, ya resueltos, aplicando el mismo patrón a un dominio independiente.

| Fichero                                | Dominio   | Tipo       | Qué muestra |
|-----------------------------------------|-----------|------------|-------------|
| `src/server.ts`                         | —         | CONTENIDO  | Arranque del servidor (`app.listen`) |
| `src/app.ts`                            | —         | CONTENIDO  | Configuración de Express y montaje de rutas |
| `src/types/document.types.ts`           | Documents | CONTENIDO  | `DocumentItem`, DTOs de entrada |
| `src/models/document.store.ts`          | Documents | CONTENIDO  | Persistencia en memoria |
| `src/services/documents.service.ts`     | Documents | CONTENIDO  | Reglas de negocio, agnóstico de Express |
| `src/controllers/documents.controller.ts` | Documents | CONTENIDO  | Traducción a HTTP + JSend |
| `src/routes/documents.routes.ts`        | Documents | CONTENIDO  | Enrutamiento `/api/documents` |
| `src/types/ticket.types.ts`             | Tickets   | EJERCICIOS | `TicketItem`, DTOs de entrada |
| `src/models/ticket.store.ts`            | Tickets   | EJERCICIOS | Persistencia en memoria |
| `src/services/tickets.service.ts`       | Tickets   | EJERCICIOS | Ej. 1 (filtrado/orden dinámico), Ej. 2 (máquina de estados), Ej. 3 (conflicto 409) |
| `src/controllers/tickets.controller.ts` | Tickets   | EJERCICIOS | Traducción a HTTP + JSend, incluye 409 y 422 |
| `src/routes/tickets.routes.ts`          | Tickets   | EJERCICIOS | Enrutamiento `/api/tickets`, incluye `PATCH /:id/status` |

Cada fichero de `services/` y `controllers/` lleva comentarios de cabecera con los conceptos
clave a explicar (JSend, códigos de error de negocio, 409 vs 422 vs 404, precedencia de rutas).

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3001
npm run typecheck
npm run build && npm start
```

## Pruebas — Documents (CONTENIDO)

```bash
curl http://localhost:3001/health

# Listar todos
curl http://localhost:3001/api/documents

# Filtrar por etiqueta
curl "http://localhost:3001/api/documents?tag=arquitectura"

# Obtener uno
curl http://localhost:3001/api/documents/1

# Crear
curl -X POST http://localhost:3001/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo documento","content":"Contenido","author":"Miguel Puch","tags":["rest"]}'

# Actualizar parcialmente (PATCH, no PUT)
curl -X PATCH http://localhost:3001/api/documents/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Título actualizado"}'

# Borrar
curl -X DELETE http://localhost:3001/api/documents/1
```

## Pruebas — Tickets (EJERCICIOS)

```bash
# Ej. 1: filtrado por status/priority + ordenación dinámica (-campo = descendente)
curl "http://localhost:3001/api/tickets?status=open&priority=high"
curl "http://localhost:3001/api/tickets?sort=-createdAt"

# Obtener uno
curl http://localhost:3001/api/tickets/1

# Ej. 3: crear (409 Conflict si ya existe un ticket no resuelto con el mismo título)
curl -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"El login no redirige tras autenticarse","description":"...","priority":"high"}'

# Ej. 2: máquina de estados (422 si se intenta "open" -> "resolved" directamente)
curl -X PATCH http://localhost:3001/api/tickets/2/status \
  -H "Content-Type: application/json" \
  -d '{"status":"resolved"}'

curl -X PATCH http://localhost:3001/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"resolved"}'

# Borrar
curl -X DELETE http://localhost:3001/api/tickets/1
```
