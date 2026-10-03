/* ============================================================================
 * CAPA DE MODELO — Documentos en memoria (CONTENIDO)
 * En memoria a propósito: los tests no dependen de red ni de una base de
 * datos, y cada fichero de test arranca con el mismo documento inicial.
 * ========================================================================== */

import { DocumentItem } from "../types/document.types.js";

class DocumentStore {
  private documents: DocumentItem[] = [
    { id: 1, title: "Arquitectura Hexagonal", author: "Alistair Cockburn" }
  ];

  findAll(): DocumentItem[] {
    return this.documents;
  }

  findById(id: number): DocumentItem | undefined {
    return this.documents.find(d => d.id === id);
  }

  create(data: Omit<DocumentItem, "id">): DocumentItem {
    const nextId = this.documents.length > 0 ? Math.max(...this.documents.map(d => d.id)) + 1 : 1;
    const nuevo: DocumentItem = { id: nextId, ...data };
    this.documents.push(nuevo);
    return nuevo;
  }
}

export const documentStore = new DocumentStore();
