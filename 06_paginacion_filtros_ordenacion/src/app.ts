import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.json" with { type: "json" };
import documentsRoutes from "./routes/documents.routes.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Paginación, Filtrado y Ordenación" });
});

// Documentación interactiva (prueba page/limit/sort/filtros desde el navegador):
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// CONTENIDO DE LA SESIÓN: paginación con MongoDB (Documents)
app.use("/api/documents", documentsRoutes);

// Captura de rutas inexistentes y manejador global de errores (siempre al final):
app.use(notFoundHandler);
app.use(globalErrorHandler);
