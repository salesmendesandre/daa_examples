import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.json" with { type: "json" };
import documentsRoutes from "./routes/documents.routes.js";
import resumesRoutes from "./routes/resumes.routes.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";

export const app = express();

// OJO: express.json() NO entiende multipart/form-data -> los archivos los
// parsea Multer, ruta por ruta (ver routes/), no un middleware global.
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Ingesta de Archivos con Multer y PDF" });
});

// Documentación interactiva (Swagger UI permite adjuntar el PDF con "Choose File"):
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Multer + extracción de texto en PDF (Documents, CONTENIDO).
app.use("/api/documents", documentsRoutes);

// CVs, Magic Bytes y extracción de skills (Resumes, EJERCICIOS).
app.use("/api/resumes", resumesRoutes);

// Captura de rutas inexistentes y manejador global de errores (siempre al final).
// Los errores de Multer (tamaño, nº de archivos, tipo) también acaban aquí.
app.use(notFoundHandler);
app.use(globalErrorHandler);
