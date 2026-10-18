# Desarrollo de Aplicaciones Avanzadas (DAA) — Código de Ejemplos Prácticos

Repositorio oficial de ejemplos prácticos y proyectos de código de la asignatura **Desarrollo de Aplicaciones Avanzadas (DAA)** (Grado en Ingeniería Informática, Universidad de Salamanca).

Este repositorio acompaña al libro interactivo de la asignatura:
📖 **Libro de la asignatura:** [https://salesmendesandre.github.io/daa/](https://salesmendesandre.github.io/daa/)

> Este repositorio se va ampliando **semana a semana**, según avanza el curso: solo contiene el código de los capítulos ya impartidos en clase.

---

## 📑 Estructura del Repositorio

El código está organizado de forma modular, con un proyecto independiente por cada capítulo temático:

| Carpeta | Capítulo | Tecnologías Principales |
| :--- | :--- | :--- |
| [`00_fundamentos_javascript/`](./00_fundamentos_javascript/) | Fundamentos de JavaScript | ES6+, Métodos funcionales, `async`/`await`, Closures, Memory Store |
| [`01_fundamentos_express_ts/`](./01_fundamentos_express_ts/) | 1. Fundamentos de APIs y Express 5 | Express 5, TypeScript, Tipado estricto, TSX, CRUD en memoria |
| [`02_diseno_rest_arquitectura/`](./02_diseno_rest_arquitectura/) | 2. Diseño REST y Arquitectura en Capas | Routers, Controllers, Services, In-Memory Repository, Separación de responsabilidades |
| [`03_persistencia_mongodb_mongoose/`](./03_persistencia_mongodb_mongoose/) | 3. Persistencia con MongoDB y Mongoose | MongoDB, Mongoose, Esquemas tipados, Conexión a base de datos, CRUD persistente |
| [`04_validacion_zod_errores/`](./04_validacion_zod_errores/) | 4. Validación con Zod y Manejo de Errores | Zod schemas, Inferencia de tipos (`z.infer`), Middlewares de validación, `AppError`, Manejador global Express 5 |
| [`05_documentacion_openapi_swagger/`](./05_documentacion_openapi_swagger/) | 5. Documentación con OpenAPI / Swagger | Swagger UI Express, OpenAPI 3.0 JSON specification, Documentación interactiva `/api/docs` |
| [`06_seguridad_observabilidad/`](./06_seguridad_observabilidad/) | 6. Seguridad y Observabilidad | Helmet (cabeceras HTTP seguras), CORS, Rate Limiting (`express-rate-limit`), Logger estructurado (Pino) |
| [`07_autenticacion_jwt_roles/`](./07_autenticacion_jwt_roles/) | 7. Autenticación JWT y Roles (RBAC) | Hash de contraseñas (`bcrypt`), Firma y verificación de tokens JWT, Middleware de autenticación Bearer, Control de acceso por roles (`user` / `admin`) |
| [`08_ingesta_archivos_multer_pdf/`](./08_ingesta_archivos_multer_pdf/) | 8. Ingesta de Archivos (Multer y PDF) | Peticiones `multipart/form-data`, Multer (`memoryStorage`), Validación de MIME type con `fileFilter`, Extracción de texto de PDFs (`pdf-parse`) |
| [`09_paginacion_filtros_ordenacion/`](./09_paginacion_filtros_ordenacion/) | 9. Paginación, Filtros y Ordenación | Paginación offset con `Promise.all`, Metadatos de paginación, Whitelist de ordenación, Filtrado por tag y búsqueda |
| [`10_testing_vitest_supertest/`](./10_testing_vitest_supertest/) | 10. Testing de APIs con Vitest y Supertest | Vitest, Supertest, Tests unitarios y de integración HTTP, `app` exportada sin `.listen()`, Almacenamiento en memoria |
| [`11_busqueda_tradicional_semantica/`](./11_busqueda_tradicional_semantica/) | 11. Búsqueda Tradicional vs. Semántica | Búsqueda léxica (índices `$text` en MongoDB), Concepto de Embeddings vectoriales, Similitud Coseno, Búsqueda semántica aproximada |
| [`12_rag_conceptual_puente_frontend/`](./12_rag_conceptual_puente_frontend/) | 12. Arquitectura RAG y Puente Frontend | Pipeline de RAG (Retrieval-Augmented Generation), Ensamblado de prompts con contexto inyectado, Tipos TypeScript compartidos, Cliente HTTP `authenticatedFetch` para Vue 3 |
| [`13_ejercicio_final_documind/`](./13_ejercicio_final_documind/) | **Proyecto Final Integrador (DocuMind)** | Se publicará más adelante (ver capítulo 12, sección 6) |

---

## 🚀 Requisitos Previos e Instalación

### Requisitos
- **Node.js**: Versión 20.x LTS o superior (recomendado 22.x o 24.x).
- **npm**: Versión 10.x o superior.

### Instalación de dependencias

El repositorio utiliza **npm workspaces**, lo que permite instalar todas las dependencias de todos los capítulos con un solo comando en la raíz:

```bash
# Desde la raíz de daa_examples/
npm install
```

O bien, puedes entrar directamente a cualquier capítulo y trabajar de manera independiente:

```bash
cd 01_fundamentos_express_ts
npm install
npm run dev
```

---

## 🛠️ Comandos Globales

Desde la raíz de `daa_examples/`:

- **Verificar tipado TypeScript en todos los proyectos:**
  ```bash
  npm run typecheck
  ```
- **Ejecutar todos los tests:**
  ```bash
  npm run test
  ```
- **Compilar todos los proyectos a JavaScript (`dist/`):**
  ```bash
  npm run build
  ```

---

## 👥 Autores y Docencia

- **André Filipe Sales Mendes** (<andremendes@usal.es> / [GitHub](https://github.com/salesmendesandre)) — Universidad de Salamanca
- **Miguel Puch Paíno** (<mpuchpaino@usal.es> / [GitHub](https://github.com/MiguelPuch)) — Universidad de Salamanca
