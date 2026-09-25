/* ============================================================================
 * CONTENIDO — Capa de SERVICIO
 * Lógica de negocio agnóstica de Express: nada de req/res aquí. El controlador
 * solo llama a estos métodos y traduce el resultado (o el error lanzado) a la
 * respuesta HTTP. Errores de negocio viajan como Error("CODIGO:detalle").
 * ========================================================================== */

import { DocumentModel } from "../models/document.model.js";
import { CreateDocumentInput } from "../types/document.types.js";

export class DocumentsService {
  async getAllDocuments(tag?: string, status?: string) {
    const filter: any = {};
    if (tag) {
      filter.tags = tag.toLowerCase();
    }
    if (status) {
      filter.status = status;
    }
    return DocumentModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async getDocumentById(id: string) {
    const doc = await DocumentModel.findById(id).exec();
    if (!doc) {
      throw new Error(`DOCUMENT_NOT_FOUND:${id}`);
    }
    return doc;
  }

  async createDocument(input: CreateDocumentInput) {
    return DocumentModel.create(input);
  }

  async updateDocument(id: string, input: Partial<CreateDocumentInput>) {
    const actualizado = await DocumentModel.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true
    }).exec();

    if (!actualizado) {
      throw new Error(`DOCUMENT_NOT_FOUND:${id}`);
    }
    return actualizado;
  }

  async deleteDocument(id: string) {
    const eliminado = await DocumentModel.findByIdAndDelete(id).exec();
    if (!eliminado) {
      throw new Error(`DOCUMENT_NOT_FOUND:${id}`);
    }
  }
}

export const documentsService = new DocumentsService();
