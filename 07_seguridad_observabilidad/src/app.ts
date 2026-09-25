import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import { logger } from "./config/logger.js";

export const app = express();

// Orden deliberado: seguridad de cabeceras primero, luego CORS, luego límite
// de tráfico, y solo al final el parseo del body — así una petición que se
// corta antes ni siquiera gasta tiempo parseando JSON.

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

// 3. Límite de tráfico:
app.use("/api", globalLimiter);

// 4. Procesamiento de cuerpo JSON:
app.use(express.json());

// 5. Endpoint de prueba con log estructurado:
app.get("/api/secure-data", (req: Request, res: Response) => {
  logger.info({ ip: req.ip, path: req.path }, "Acceso autorizado a recurso protegido");
  res.json({ status: "success", data: "Información confidencial servida de forma segura" });
});
