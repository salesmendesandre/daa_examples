import { Request, Response } from "express";
import * as docsService from "../services/documents.service.js";

export const getAllDocuments = (req: Request, res: Response) => {
  const { tag, sort } = req.query;
  const docs = docsService.findAll(
    typeof tag === "string" ? tag : undefined,
    typeof sort === "string" ? sort : undefined
  );
  res.status(200).json(docs);
};

export const getDocumentById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID debe ser un número válido" });
  }

  const doc = docsService.findById(id);
  if (!doc) {
    return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
  }

  res.status(200).json(doc);
};

export const createDocument = (req: Request, res: Response) => {
  const { title, content, author, tags } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ error: "Faltan campos obligatorios ('title', 'content', 'author')" });
  }

  const nuevo = docsService.create({ title, content, author, tags });
  res.status(201).json(nuevo);
};

export const updateDocument = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID debe ser un número válido" });
  }

  const actualizado = docsService.update(id, req.body);
  if (!actualizado) {
    return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
  }

  res.status(200).json(actualizado);
};

export const deleteDocument = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID debe ser un número válido" });
  }

  const borrado = docsService.remove(id);
  if (!borrado) {
    return res.status(404).json({ error: `Documento con ID ${id} no encontrado` });
  }

  res.status(204).send();
};
