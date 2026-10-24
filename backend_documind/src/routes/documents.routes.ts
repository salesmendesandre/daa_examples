import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { DocumentModel } from "../models/document.model.js";
import { CreateDocumentSchema, DocumentQuerySchema, UpdateDocumentSchema } from "../schemas/document.schema.js";
import { validateBody, validateQuery } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadMemory } from "../config/multer.js";
import { computeEmbedding, cosineSimilarity } from "../services/embedding.util.js";
import { emitDocumentEvent } from "../realtime/events.js";

const router = Router();

// Un ObjectId de MongoDB son 24 caracteres hexadecimales. Validarlo antes de consultar
// evita que Mongoose lance un CastError (que acabaría como 500) ante ids mal formados.
const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!/^[a-f\d]{24}$/i.test(String(req.params.id))) {
    return res.status(400).json({ status: "fail", error: "Identificador de documento no válido" });
  }
  next();
};

// Envuelve a Multer para traducir sus errores a códigos HTTP claros para el cliente
// (sin esto, un fichero demasiado grande acabaría como 500 en el manejador global).
const receiveFile = (req: Request, res: Response, next: NextFunction) => {
  uploadMemory.single("file")(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ status: "fail", error: "El fichero supera el tamaño máximo permitido (10 MB)" });
      }
      return res.status(400).json({ status: "fail", error: `Error en la subida del fichero: ${err.message}` });
    }
    next(err); // p. ej. el 415 del fileFilter
  });
};

// Las etiquetas llegan como texto en multipart/form-data: se espera un array JSON de cadenas.
const parseUploadTags = (raw: unknown): string[] | null => {
  if (raw === undefined || raw === "") return ["pdf-upload"];
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed) || !parsed.every(t => typeof t === "string")) return null;
    return parsed.map(t => t.trim().toLowerCase()).filter(Boolean);
  } catch {
    return null;
  }
};

// 1. Listado paginado y con filtros
router.get("/", validateQuery(DocumentQuerySchema), async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = "-createdAt", tag, status } = req.query as any;

  const filter: any = {};
  if (tag) filter.tags = String(tag).toLowerCase();
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const sortOption: any = {};
  if (typeof sort === "string") {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.slice(1) : sort;
    sortOption[field] = isDesc ? -1 : 1;
  }
  // Desempate por _id: si varios documentos comparten el valor ordenado (p. ej. el mismo
  // createdAt), el orden sería arbitrario y un documento podría repetirse entre páginas.
  sortOption._id = sortOption._id ?? -1;

  const [data, total] = await Promise.all([
    DocumentModel.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).exec(),
    DocumentModel.countDocuments(filter).exec()
  ]);

  const totalPages = Math.ceil(total / Number(limit)) || 1;

  res.json({
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    }
  });
});

// 2. Búsqueda Léxica ($text)
router.get("/search/text", async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Parámetro 'q' requerido" });
  }

  const results = await DocumentModel.find(
    { $text: { $search: q } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .exec();

  res.json({ query: q, total: results.length, results });
});

// 3. Búsqueda Semántica Vectorial
router.post("/search/semantic", async (req: Request, res: Response) => {
  const { query, limit = 5 } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Campo 'query' requerido" });
  }

  const queryVector = computeEmbedding(String(query));
  const allDocs = await DocumentModel.find({}).exec();

  const ranked = allDocs
    .map(doc => ({
      document: doc,
      score: cosineSimilarity(queryVector, doc.embedding || [])
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit));

  res.json({
    query,
    results: ranked.map(r => ({
      id: r.document._id,
      title: r.document.title,
      content: r.document.content,
      tags: r.document.tags,
      score: r.score
    }))
  });
});

// 4. Ingesta de PDF con extracción y vectorización
router.post("/upload-pdf", authenticate, receiveFile, async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: "fail", error: "Fichero 'file' no proporcionado" });
  }

  const tags = parseUploadTags(req.body.tags);
  if (!tags) {
    return res.status(400).json({ status: "fail", error: "El campo 'tags' debe ser un array JSON de cadenas, p. ej. [\"vue\",\"apuntes\"]" });
  }

  const title = String(req.body.title || req.file.originalname.replace(/\.[^/.]+$/, "")).trim();
  if (title.length < 3 || title.length > 150) {
    return res.status(400).json({ status: "fail", error: "El título debe tener entre 3 y 150 caracteres" });
  }

  let textContent: string;
  let numPages: number | null;
  if (req.file.mimetype.startsWith("text/")) {
    textContent = req.file.buffer.toString("utf8").trim();
    numPages = null;
  } else {
    try {
      const pdfData = await pdfParse(req.file.buffer);
      textContent = pdfData.text.trim();
      numPages = pdfData.numpages;
    } catch {
      // El cliente envió algo que dice ser un PDF pero no se puede leer: es un error suyo (400), no del servidor.
      return res.status(400).json({ status: "fail", error: "El fichero no es un PDF válido o está dañado" });
    }
  }

  if (textContent.length < 10) {
    return res.status(400).json({ status: "fail", error: "El documento no contiene texto legible suficiente (mínimo 10 caracteres)" });
  }

  const embedding = computeEmbedding(`${title} ${textContent}`);
  const newDoc = await DocumentModel.create({
    title,
    content: textContent,
    authorId: req.user!.userId,
    authorName: req.user!.fullName,
    tags,
    status: "published",
    embedding
  });

  // Aviso en tiempo real (capítulo 26): solo después de que la operación haya tenido éxito
  emitDocumentEvent("created", newDoc, req.user!);

  res.status(201).json({
    message: "PDF procesado e indexado con éxito",
    document: newDoc,
    numPages
  });
});

// 5. Creación estándar de documento
router.post("/", authenticate, validateBody(CreateDocumentSchema), async (req: Request, res: Response) => {
  const { title, content, tags, status } = req.body;
  const embedding = computeEmbedding(`${title} ${content}`);

  const document = await DocumentModel.create({
    title,
    content,
    tags,
    status,
    authorId: req.user!.userId,
    authorName: req.user!.fullName,
    embedding
  });

  emitDocumentEvent("created", document, req.user!);
  res.status(201).json(document);
});

// 6. Obtener por ID
router.get("/:id", validateObjectId, async (req: Request, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id).exec();
  if (!doc) return res.status(404).json({ error: "Documento no encontrado" });
  res.json(doc);
});

// 7. Actualización parcial (requiere ser autor o administrador)
router.patch("/:id", authenticate, validateObjectId, validateBody(UpdateDocumentSchema), async (req: Request, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id).exec();
  if (!doc) return res.status(404).json({ error: "Documento no encontrado" });

  const isOwner = doc.authorId === req.user?.userId;
  const isAdmin = req.user?.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "No tienes permisos para modificar este documento" });
  }

  doc.set(req.body);
  // Si cambia el texto, el vector semántico debe recalcularse para que la búsqueda siga siendo coherente.
  if (req.body.title !== undefined || req.body.content !== undefined) {
    doc.embedding = computeEmbedding(`${doc.title} ${doc.content}`);
  }
  await doc.save();

  emitDocumentEvent("updated", doc, req.user!);
  res.json(doc);
});

// 8. Borrado (requiere ser autor o administrador)
router.delete("/:id", authenticate, validateObjectId, async (req: Request, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id).exec();
  if (!doc) return res.status(404).json({ error: "Documento no encontrado" });

  const isOwner = doc.authorId === req.user?.userId;
  const isAdmin = req.user?.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "No tienes permisos para eliminar este documento" });
  }

  await DocumentModel.findByIdAndDelete(req.params.id).exec();
  emitDocumentEvent("deleted", doc, req.user!);
  res.status(204).send();
});

export default router;
