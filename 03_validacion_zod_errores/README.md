# 03 · Validación con Zod y Manejo Centralizado de Errores

Proyecto de apoyo al capítulo **"Validación de Esquemas con Zod y Manejo Centralizado de
Errores"**. Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada
(`app.listen`), `src/app.ts` con la configuración de Express.

## Estructura

```
src/
├── server.ts                      → arranque del servidor
├── app.ts                         → configuración de Express + endpoint validado
├── schemas/document.schema.ts     → CreateDocumentSchema/UpdateDocumentSchema (Zod)
├── middlewares/
│   ├── validate.middleware.ts     → validateBody/validateQuery genéricos y reutilizables
│   └── error.middleware.ts        → notFoundHandler + globalErrorHandler centralizado
└── errors/app.error.ts            → clase base AppError (errores operacionales tipados)
```

> Este capítulo aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3003
npm run typecheck
npm run build && npm start
```

## Probar en directo

```bash
# Válido -> 201
curl -X POST http://localhost:3003/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Clean Code\",\"content\":\"Principios de código limpio\",\"author\":\"Robert C. Martin\"}"

# Inválido (title demasiado corto) -> 400 con detalle de campo
curl -X POST http://localhost:3003/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hi\",\"content\":\"Muy corto\",\"author\":\"A\"}"

# Ruta inexistente -> 404 (notFoundHandler)
curl http://localhost:3003/api/nope
```
