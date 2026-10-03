/* ============================================================================
 * CAPA DE SERVICIO — Documents (CONTENIDO)
 * ========================================================================== */

import { documentStore } from "../models/document.store.js";
import { DocumentItem } from "../types/document.types.js";
import { CreateDocumentDTO } from "../schemas/document.schema.js";
import { AppError } from "../errors/app.error.js";

export class DocumentsService {
  getAllDocuments(): DocumentItem[] {
    return documentStore.findAll();
  }

  getDocumentById(id: number): DocumentItem {
    const doc = documentStore.findById(id);
    if (!doc) throw new AppError("Documento no encontrado", 404);
    return doc;
  }

  createDocument(input: CreateDocumentDTO): DocumentItem {
    return documentStore.create(input);
  }
}

export const documentsService = new DocumentsService();
