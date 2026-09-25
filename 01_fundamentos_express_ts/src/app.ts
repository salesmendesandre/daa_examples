import express, { Request, Response } from "express";
import documentsRoutes from "./routes/documents.routes.js";
import productsRoutes from "./routes/products.routes.js";

export const app = express();

app.use(express.json());

// Endpoint de verificación de salud (Liveness probe)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CONTENIDO: Fundamentos de APIs REST y Express 5 (ver routes/documents.routes.ts)
app.use("/api/documents", documentsRoutes);

// EJERCICIOS RESUELTOS: Catálogo de Productos (ver routes/products.routes.ts)
app.use("/api/products", productsRoutes);
