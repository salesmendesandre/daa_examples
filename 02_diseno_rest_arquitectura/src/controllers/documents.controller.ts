/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Capa de CONTROLADOR
 * Único punto donde se toca req/res: extrae datos de la petición, delega
 * TODA la lógica en el servicio, y traduce el resultado (o el error lanzado
 * por el servicio) a la respuesta HTTP con formato JSend:
 *   { status: "success", data }  |  { status: "fail", message }
 * ========================================================================== */

import { Request, Response } from "express";
import { documentsService } from "../services/documents.service.js";

export class DocumentsController {
  getAll = (req: Request, res: Response) => {
    const tag = req.query.tag as string | undefined;
    const data = documentsService.getAllDocuments(tag);
    res.json({ status: "success", count: data.length, data });
  };

  getById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "El ID debe ser un número entero válido" });
    }
    try {
      const doc = documentsService.getDocumentById(id);
      res.json({ status: "success", data: doc });
    } catch (err: any) {
      if (err.message?.startsWith("DOCUMENT_NOT_FOUND")) {
        return res.status(404).json({ status: "fail", message: "Documento no encontrado" });
      }
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };

  create = (req: Request, res: Response) => {
    try {
      const created = documentsService.createDocument(req.body);
      res.status(201).json({ status: "success", data: created });
    } catch (err: any) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  };

  update = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "El ID debe ser numérico" });
    }
    try {
      const updated = documentsService.updateDocument(id, req.body);
      res.json({ status: "success", data: updated });
    } catch (err: any) {
      if (err.message?.startsWith("DOCUMENT_NOT_FOUND")) {
        return res.status(404).json({ status: "fail", message: "Documento no encontrado" });
      }
      res.status(400).json({ status: "fail", message: err.message });
    }
  };

  delete = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "El ID debe ser numérico" });
    }
    try {
      documentsService.deleteDocument(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message?.startsWith("DOCUMENT_NOT_FOUND")) {
        return res.status(404).json({ status: "fail", message: "Documento no encontrado" });
      }
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };
}

export const documentsController = new DocumentsController();
