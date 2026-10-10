/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Servidor de la API Preparado para Testing
 * app SE EXPORTA (no se auto-arranca aquí): Supertest toma esta instancia
 * y le asigna un puerto efímero él solo, sin necesidad de "npm run dev".
 * app.listen() vive únicamente en server.ts.
 * Con las capas, cada test de integración recorre de verdad el pipeline:
 * Zod -> Middlewares -> Controlador -> Servicio -> HTTP.
 * ========================================================================== */

import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.json" with { type: "json" };
import documentsRoutes from "./routes/documents.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Testing Automatizado con Vitest y Supertest" });
});

// Documentación interactiva (para probar a mano lo mismo que verifican los tests):
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// CONTENIDO DE LA SESIÓN: Documents, la API que prueba la suite de integración
app.use("/api/documents", documentsRoutes);

// EJERCICIOS (ya corregidos en clase): API de Gestión de Tareas (dominio distinto,
// para practicar los 3 tipos de test sin poder copiar literalmente la suite de arriba).
// El middleware de auth (JWT) no se monta aquí: vive dentro de tasksRoutes, aplicado
// solo a GET /admin/metrics (Ejercicio 3), igual que en la fuente de la sesión.
app.use("/api/tasks", tasksRoutes);

// Captura de rutas inexistentes y manejador global de errores (siempre al final):
app.use(notFoundHandler);
app.use(globalErrorHandler);
