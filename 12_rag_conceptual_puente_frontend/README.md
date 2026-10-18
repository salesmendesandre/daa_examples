# 12 · Arquitectura RAG y Puente hacia el Frontend

Código del capítulo **12: Arquitectura RAG y Puente hacia el Frontend (Vue 3)**. Los archivos de `src/` son los que se muestran en el libro.

- `src/types/rag.types.ts` → tipos del pipeline RAG.
- `src/services/rag.service.ts` → recuperación de fragmentos y aumento del prompt.
- `src/app.ts` → endpoint `POST /api/rag/ask` con CORS para Vue en `http://localhost:5173` (puerto 3012).
- `src/client/apiClient.ts` → cliente Axios con token Bearer y gestión global de `401`.

## Ejecución

```bash
npm install
npm run dev
npm run typecheck
```
