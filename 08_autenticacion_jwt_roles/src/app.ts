import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.json" with { type: "json" };
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import hospitalAuthRoutes from "./routes/hospitalAuth.routes.js";
import clinicalRecordsRoutes from "./routes/clinicalRecords.routes.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Autenticación JWT + RBAC" });
});

// Documentación interactiva (botón Authorize -> pega el token del login):
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// CONTENIDO: dominio "Users" (registro, login, /me y RBAC de admin).
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// EJERCICIOS: Sistema Clínico Hospitalario (dominio "Hospital").
app.use("/api/hospital-auth", hospitalAuthRoutes);
app.use("/api/clinical-records", clinicalRecordsRoutes);

// Captura de rutas inexistentes y manejador global de errores (siempre al final):
app.use(notFoundHandler);
app.use(globalErrorHandler);
