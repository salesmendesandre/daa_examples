import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import { correlationIdMiddleware } from "./middlewares/correlationId.middleware.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";
import { logger } from "./config/logger.js";
import paymentsRoutes from "./routes/payments.routes.js";

export const app = express();

// Orden deliberado: seguridad de cabeceras primero, luego CORS, luego
// trazabilidad (Correlation ID), luego límite de tráfico, y solo al final
// el parseo del body — así una petición que se corta antes ni siquiera
// gasta tiempo parseando JSON.

// 1. Cabeceras de seguridad:
app.use(helmet());

// 2. Control estricto de CORS:
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);

// 3. EJERCICIO 2: Correlation ID en cada petición (X-Request-Id).
app.use(correlationIdMiddleware);

// 4. Límite de tráfico:
app.use("/api", globalLimiter);

// 5. Procesamiento de cuerpo JSON:
app.use(express.json());

// 6. Endpoint de prueba con log estructurado:
app.get("/api/secure-data", (req: Request, res: Response) => {
  logger.info({ ip: req.ip, path: req.path, requestId: req.requestId }, "Acceso autorizado a recurso protegido");
  res.json({ status: "success", data: "Información confidencial servida de forma segura" });
});

// EJERCICIOS: Pasarela de Pagos (Ej.1 rate limit estricto, Ej.3 Helmet/CORS reforzados):
app.use("/api/payments", paymentsRoutes);

// Captura de rutas inexistentes y manejador global de errores (siempre al final, en este orden):
app.use(notFoundHandler);
app.use(globalErrorHandler);
