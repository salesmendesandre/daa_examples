/* ============================================================================
 * CONTENIDO: Fundamentos de APIs REST y Express 5 con TypeScript
 * CRUD de Documentos en memoria
 *
 * Conceptos clave:
 * - Verbos HTTP y su semántica (GET/POST/DELETE) + idempotencia.
 * - Diferencia entre parámetro de ruta (:id) y query parameter (?tag=...).
 * - Códigos de estado: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 204 No Content.
 * ========================================================================== */

import { Router, Request, Response } from "express";
import { DocumentItem, CreateDocumentDTO } from "../types.js";

const router = Router();

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

// GET /api/documents
// Query parameter OPCIONAL (?tag=...): filtra la colección, no identifica un recurso.
// Siempre responde 200, incluso si el filtro no encuentra nada (array vacío).
router.get("/", (req: Request, res: Response) => {
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

// GET /api/documents/:id
// Parámetro de RUTA (:id): identifica un recurso concreto, no es opcional.
// Dos fuentes distintas de error 400 vs 404:
//   - 400 Bad Request -> el propio ID está mal formado (no es un número).
//   - 404 Not Found    -> el ID es válido pero ese recurso no existe.
router.get("/:id", (req: Request, res: Response) => {
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

// POST /api/documents
// Crea un recurso nuevo -> NO es idempotente (llamarlo 2 veces crea 2 documentos).
// Validación manual mínima (antes de Zod, que se verá más adelante).
// 201 Created: éxito al crear, se devuelve el recurso completo ya con su ID generado.
router.post("/", (req: Request<{}, {}, CreateDocumentDTO>, res: Response) => {
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

// DELETE /api/documents/:id
// SÍ es idempotente: borrarlo 2 veces dejan el mismo estado final (el recurso no existe),
// aunque la segunda llamada responda 404 en vez de 204.
// 204 No Content: éxito sin cuerpo de respuesta (no hay nada que devolver).
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = documents.findIndex(doc => doc.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
  }

  documents.splice(index, 1);
  res.status(204).send();
});

export default router;
