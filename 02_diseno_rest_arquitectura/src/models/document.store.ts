import { DocumentItem, CreateDocumentInput, UpdateDocumentInput } from "../types/document.types.js";

class DocumentStore {
  private documents: DocumentItem[] = [
    {
      id: 1,
      title: "Arquitectura en Capas",
      content: "Separación clara entre controladores, servicios y modelos.",
      author: "André Mendes",
      tags: ["arquitectura", "backend", "express"],
      createdAt: "2026-01-10T10:00:00.000Z"
    },
    {
      id: 2,
      title: "Convenciones RESTful",
      content: "Nombres de recursos en plural, códigos de estado semánticos e idempotencia.",
      author: "Miguel Puch",
      tags: ["rest", "http", "api"],
      createdAt: "2026-01-15T12:00:00.000Z"
    }
  ];

  findAll(): DocumentItem[] {
    return [...this.documents];
  }

  findById(id: number): DocumentItem | null {
    const doc = this.documents.find(d => d.id === id);
    return doc ? { ...doc } : null;
  }

  create(input: CreateDocumentInput): DocumentItem {
    const nextId = this.documents.length > 0 ? Math.max(...this.documents.map(d => d.id)) + 1 : 1;
    const newDoc: DocumentItem = {
      id: nextId,
      title: input.title.trim(),
      content: input.content.trim(),
      author: input.author.trim(),
      tags: input.tags ? input.tags.map(t => t.trim().toLowerCase()) : [],
      createdAt: new Date().toISOString()
    };
    this.documents.push(newDoc);
    return { ...newDoc };
  }

  update(id: number, input: UpdateDocumentInput): DocumentItem | null {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return null;

    const existing = this.documents[index];
    const updated: DocumentItem = {
      ...existing,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      content: input.content !== undefined ? input.content.trim() : existing.content,
      tags: input.tags !== undefined ? input.tags.map(t => t.trim().toLowerCase()) : existing.tags
    };

    this.documents[index] = updated;
    return { ...updated };
  }

  delete(id: number): boolean {
    const initialLen = this.documents.length;
    this.documents = this.documents.filter(d => d.id !== id);
    return this.documents.length < initialLen;
  }
}

export const documentStore = new DocumentStore();
