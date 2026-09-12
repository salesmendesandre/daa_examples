import { documentStore } from "../models/document.store.js";
import { DocumentItem, CreateDocumentInput, UpdateDocumentInput } from "../types/document.types.js";

export const findAll = (tag?: string, sort?: string): DocumentItem[] => {
  let docs = documentStore.findAll();

  // Filtrado por etiqueta
  if (tag) {
    const t = tag.toLowerCase();
    docs = docs.filter(d => d.tags.includes(t));
  }

  // Ordenación dinámica (+campo o -campo para descendente)
  if (sort) {
    const isDesc = sort.startsWith("-");
    const field = (isDesc ? sort.slice(1) : sort) as keyof DocumentItem;

    if (field === "title" || field === "createdAt") {
      docs = [...docs].sort((a, b) => {
        const valA = String(a[field]);
        const valB = String(b[field]);
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }
  }

  return docs;
};

export const findById = (id: number): DocumentItem | null => {
  return documentStore.findById(id);
};

export const create = (input: CreateDocumentInput): DocumentItem => {
  return documentStore.create(input);
};

export const update = (id: number, input: UpdateDocumentInput): DocumentItem | null => {
  return documentStore.update(id, input);
};

export const remove = (id: number): boolean => {
  return documentStore.delete(id);
};
