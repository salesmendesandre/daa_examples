/* ============================================================================
 * CAPA DE CONTROLADOR — Documents (CONTENIDO)
 * Mismas respuestas que el app.ts del libro: son las que comprueba la suite
 * de integración (tests/integration/documents.api.test.ts).
 * ========================================================================== */

import { Request, Response } from "express";
import { documentsService } from "../services/documents.service.js";

export const getAllDocuments = (_req: Request, res: Response) => {
  const documents = documentsService.getAllDocuments();
  res.json({ status: "success", count: documents.length, data: documents });
};

export const getDocumentById = (req: Request, res: Response) => {
  const doc = documentsService.getDocumentById(Number(req.params.id));
  res.json({ status: "success", data: doc });
};

export const createDocument = (req: Request, res: Response) => {
  const nuevo = documentsService.createDocument(req.body);
  res.status(201).json({ status: "success", data: nuevo });
};
