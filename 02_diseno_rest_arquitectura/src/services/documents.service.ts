/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Capa de SERVICIO
 * Reglas de negocio 100% agnósticas de Express: nada de req/res aquí, solo
 * datos y lógica. Esto es lo que se testea sin levantar un servidor HTTP.
 * Comunica errores de negocio como Error("CODIGO:mensaje") que el controlador
 * interpreta y traduce al código HTTP correspondiente.
 * ========================================================================== */

import { documentStore } from "../models/document.store.js";
import { DocumentItem, CreateDocumentInput, UpdateDocumentInput } from "../types/document.types.js";

export class DocumentsService {
  getAllDocuments(tag?: string): DocumentItem[] {
    const all = documentStore.findAll();
    if (!tag) return all;
    const normalizedTag = tag.trim().toLowerCase();
    return all.filter(doc => doc.tags.some(t => t.toLowerCase() === normalizedTag));
  }

  getDocumentById(id: number): DocumentItem {
    const doc = documentStore.findById(id);
    if (!doc) {
      throw new Error(`DOCUMENT_NOT_FOUND:${id}`);
    }
    return doc;
  }

  createDocument(input: CreateDocumentInput): DocumentItem {
    if (!input.title || !input.content || !input.author) {
      throw new Error("INVALID_DATA:title, content and author are required");
    }
    return documentStore.create(input);
  }

  // PATCH, no PUT: actualización PARCIAL (ver sección 5 del capítulo, PUT vs PATCH).
  updateDocument(id: number, input: UpdateDocumentInput): DocumentItem {
    const updated = documentStore.update(id, input);
    if (!updated) {
      throw new Error(`DOCUMENT_NOT_FOUND:${id}`);
    }
    return updated;
  }

  deleteDocument(id: number): void {
    const deleted = documentStore.delete(id);
    if (!deleted) {
      throw new Error(`DOCUMENT_NOT_FOUND:${id}`);
    }
  }
}

export const documentsService = new DocumentsService();
