import express, { Request, Response } from "express";
import documentsRoutes from "./routes/documents.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Arquitectura Modular en Capas" });
});

// CONTENIDO DE LA SESIÓN: Diseño RESTful y Arquitectura en Tres Capas (Documents)
app.use("/api/documents", documentsRoutes);

// EJERCICIOS CORREGIDOS (Sesión 2): Sistema de Tickets (mismo patrón, otro dominio)
app.use("/api/tickets", ticketsRoutes);
