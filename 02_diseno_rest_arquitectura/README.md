# 02: Diseño REST y Arquitectura en Capas

Ejemplo correspondiente al **Capítulo 2: Diseño de APIs REST y Arquitectura de Software**.

## Estructura de Capas
- `src/routes/`: Enrutamiento HTTP puro sin lógica de negocio.
- `src/controllers/`: Extracción de parámetros (`params`, `query`, `body`) y emisión de respuestas HTTP con códigos de estado semánticos.
- `src/services/`: Lógica de negocio independiente del framework web (ordenación, filtrado, reglas de dominio).
- `src/models/`: Almacén de datos (actualmente en memoria, sustituible por base de datos sin alterar controladores).
- `src/types/`: Interfaces TypeScript de entidades y DTOs de entrada.

## Ejecución

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Pruebas

```bash
# Listar con ordenación descendente por fecha de creación:
curl "http://localhost:3001/api/documents?sort=-createdAt"

# Filtrar por etiqueta:
curl "http://localhost:3001/api/documents?tag=arquitectura"
```
