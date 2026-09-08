import express, { Request, Response } from "express";
import { DocumentItem, CreateDocumentDTO } from "./types.js";

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Repositorio en memoria inicial
let documents: DocumentItem[] = [
  {
    id: 1,
    title: "Introducción a Node.js",
    content: "Node.js es un entorno de ejecución basado en V8.",
    author: "André Mendes",
    tags: ["nodejs", "backend", "javascript"],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Principios REST",
    content: "REST utiliza métodos HTTP estándar y recursos URI.",
    author: "Miguel Puch",
    tags: ["rest", "api", "arquitectura"],
    createdAt: new Date().toISOString()
  }
];

// Endpoint de verificación de salud (Liveness probe)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Listar documentos con soporte de filtro opcional por etiqueta (?tag=...)
app.get("/api/documents", (req: Request, res: Response) => {
  const { tag } = req.query;

  if (typeof tag === "string" && tag.trim() !== "") {
    const tagFilter = tag.trim().toLowerCase();
    const filtered = documents.filter(doc =>
      doc.tags.some(t => t.toLowerCase() === tagFilter)
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(documents);
});

// Obtener un documento por ID
app.get("/api/documents/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El parámetro ID debe ser un número entero válido" });
  }

  const document = documents.find(doc => doc.id === id);
  if (!document) {
    return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
  }

  res.status(200).json(document);
});

// Crear nuevo documento
app.post("/api/documents", (req: Request<{}, {}, CreateDocumentDTO>, res: Response) => {
  const { title, content, author, tags } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({
      error: "Los campos 'title', 'content' y 'author' son obligatorios"
    });
  }

  const nextId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;

  const newDocument: DocumentItem = {
    id: nextId,
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    tags: Array.isArray(tags) ? tags.map(t => String(t).trim().toLowerCase()) : [],
    createdAt: new Date().toISOString()
  };

  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Eliminar documento
app.delete("/api/documents/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = documents.findIndex(doc => doc.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
  }

  documents.splice(index, 1);
  res.status(204).send();
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[DocuMind API] Servidor Express 5 escuchando en http://localhost:${PORT}`);
  });
}
