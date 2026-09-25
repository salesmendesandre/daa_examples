import express, { Request, Response } from "express";
import documentsRoutes from "./routes/documents.routes.js";
import coursesRoutes from "./routes/courses.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Persistencia con MongoDB y Mongoose" });
});

// CONTENIDO: Persistencia con MongoDB y Mongoose (Documents)
app.use("/api/documents", documentsRoutes);

// EJERCICIOS (Ej.1 middleware validateObjectId, Ej.2 subdocumentos anidados,
// Ej.3 soft delete): Cursos Universitarios, mismo patrón que Documents.
app.use("/api/courses", coursesRoutes);
