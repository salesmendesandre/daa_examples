# 04 · Documentación de APIs con OpenAPI y Swagger UI

Proyecto de apoyo al capítulo **"Documentación de APIs con OpenAPI y Swagger UI"**. Scaffold
igual al del resto de capítulos: `src/server.ts` como punto de entrada, `src/app.ts` con la
configuración de Express.

## Estructura

```
src/
├── server.ts             → arranque del servidor
├── app.ts                → configuración de Express + montaje de Swagger UI
└── docs/openapi.json     → especificación OpenAPI 3.0 formal de /api/documents
```

> Este capítulo aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3004
npm run typecheck
npm run build && npm start
```

## Probar en directo

- **Swagger UI**: [http://localhost:3004/api/docs](http://localhost:3004/api/docs) — consola
  interactiva generada a partir de `docs/openapi.json`, con botón "Try it out".
- **curl**:
  ```bash
  curl http://localhost:3004/api/documents
  ```
