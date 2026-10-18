/* ============================================================================
 * CONTENIDO — Controlador de Operaciones Asíncronas
 * Único punto donde se toca req/res: extrae datos de la petición, delega TODA
 * la lógica en documentsService y traduce el resultado (o el error) a HTTP.
 * ========================================================================== */

import { Request, Response } from "express";
import { documentsService } from "../services/documents.service.js";

export const getAllDocuments = async (req: Request, res: Response) => {
  const { tag, status } = req.query;

  const docs = await documentsService.getAllDocuments(
    typeof tag === "string" ? tag : undefined,
    typeof status === "string" ? status : undefined
  );
  res.json(docs);
};

// req.params.id llega como string; Mongoose lo castea a ObjectId internamente
// (si no es válido, lanza CastError -> por eso el Ejercicio 1 valida antes).
export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const doc = await documentsService.getDocumentById(req.params.id as string);
    res.json(doc);
  } catch (err: any) {
    if (err.message?.startsWith("DOCUMENT_NOT_FOUND")) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }
    throw err;
  }
};

export const createDocument = async (req: Request, res: Response) => {
  const { title, content, author, tags, status } = req.body;
  const nuevo = await documentsService.createDocument({ title, content, author, tags, status });
  res.status(201).json(nuevo);
};

// { new: true } -> devuelve el documento YA actualizado (por defecto Mongoose
// devuelve el original antes del cambio). runValidators reaplica el schema.
export const updateDocument = async (req: Request, res: Response) => {
  try {
    const actualizado = await documentsService.updateDocument(req.params.id as string, req.body);
    res.json(actualizado);
  } catch (err: any) {
    if (err.message?.startsWith("DOCUMENT_NOT_FOUND")) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }
    throw err;
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    await documentsService.deleteDocument(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    if (err.message?.startsWith("DOCUMENT_NOT_FOUND")) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }
    throw err;
  }
};
