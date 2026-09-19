# 05: Persistencia con MongoDB y Mongoose

Ejemplo correspondiente al **Capítulo 5: Persistencia con MongoDB y Mongoose**.

## Contenido
- Conexión resiliente a MongoDB con eventos de desconexión y reconexión (`src/config/database.ts`).
- Definición de esquemas e inferencia de tipos estáticos con TypeScript (`InferSchemaType<typeof DocumentSchema>`).
- Índices de texto y de etiquetas para optimizar búsquedas.
- Operaciones asíncronas de base de datos con `Model.find()`, `create()`, `findByIdAndUpdate()`, `findByIdAndDelete()`.

## Requisitos y Ejecución

Asegúrate de tener MongoDB ejecutándose localmente (por ejemplo, con `docker compose up -d` desde la raíz de `daa_examples`):

```bash
npm install
npm run dev
npm run typecheck
```
