import { Request, Response } from "express";
import { DocumentModel } from "../models/document.model.js";

export const getAllDocuments = async (req: Request, res: Response) => {
  const { tag, status } = req.query;
  const filter: any = {};

  if (typeof tag === "string") {
    filter.tags = tag.toLowerCase();
  }
  if (typeof status === "string") {
    filter.status = status;
  }

  const docs = await DocumentModel.find(filter).sort({ createdAt: -1 }).exec();
  res.json(docs);
};

export const getDocumentById = async (req: Request, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id).exec();
  if (!doc) {
    return res.status(404).json({ error: "Documento no encontrado" });
  }
  res.json(doc);
};

export const createDocument = async (req: Request, res: Response) => {
  const { title, content, author, tags, status } = req.body;
  const nuevo = await DocumentModel.create({ title, content, author, tags, status });
  res.status(201).json(nuevo);
};

export const updateDocument = async (req: Request, res: Response) => {
  const actualizado = await DocumentModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).exec();

  if (!actualizado) {
    return res.status(404).json({ error: "Documento no encontrado" });
  }
  res.json(actualizado);
};

export const deleteDocument = async (req: Request, res: Response) => {
  const eliminado = await DocumentModel.findByIdAndDelete(req.params.id).exec();
  if (!eliminado) {
    return res.status(404).json({ error: "Documento no encontrado" });
  }
  res.status(204).send();
};
