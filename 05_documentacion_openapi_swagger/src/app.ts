import express from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.json" with { type: "json" };
import booksRoutes from "./routes/books.routes.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json());

// Portal interactivo de documentación en Swagger UI:
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Endpoint mock para validar en vivo el contrato:
app.get("/api/documents", (_req, res) => {
  res.json({
    status: "success",
    count: 1,
    data: [
      {
        id: 1,
        title: "Clean Code en TypeScript",
        content: "Contenido del documento...",
        author: "Robert C. Martin",
        tags: ["typescript", "clean-code"],
        createdAt: "2026-01-10T10:00:00.000Z"
      }
    ]
  });
});

// EJERCICIOS: Catálogo de Libros (Ej.1 GET por ISBN, Ej.2 schemas, Ej.3 bearerAuth):
app.use("/api/books", booksRoutes);

// Captura de rutas inexistentes y manejador global de errores (siempre al final, en este orden):
app.use(notFoundHandler);
app.use(globalErrorHandler);
