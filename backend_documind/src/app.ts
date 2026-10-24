import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { logger } from "./config/logger.js";
import { allowedOrigins } from "./config/cors.js";
import authRoutes from "./routes/auth.routes.js";
import documentsRoutes from "./routes/documents.routes.js";
import ragRoutes from "./routes/rag.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import openApiSpec from "./docs/openapi.json" with { type: "json" };

export const app = express();

// 1. Cabeceras de seguridad
app.use(helmet());

// 2. CORS: solo los orígenes del frontend (por defecto, el servidor de desarrollo de Vite).
// El JWT viaja en la cabecera Authorization, así que no hacen falta cookies (credentials).
// La lista vive en config/cors.ts porque Socket.IO (src/realtime) usa la misma.
app.use(cors({ origin: allowedOrigins }));

// 3. Logger estructurado
app.use(pinoHttp({ logger }));

// 4. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/", limiter);

app.use(express.json({ limit: "2mb" }));

// 5. Documentación OpenAPI / Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// 6. Endpoint de Salud
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "DocuMind Master API", version: "1.0.0" });
});

// 7. Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/rag", ragRoutes);

// 8. Manejo de 404 y Errores Globales
app.use(notFound);
app.use(errorHandler);
