import express from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.json" with { type: "json" };

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
