// Forma del body que llega en POST/PUT /api/documents. No es el documento
// persistido (eso es IDocument, en models/document.model.ts): aquí no hay
// _id, createdAt ni updatedAt porque esos campos los pone Mongoose, nunca el
// cliente.

import { IDocument } from "../models/document.model.js";

export interface CreateDocumentInput {
  title: string;
  content: string;
  author: string;
  tags?: string[];
  status?: IDocument["status"];
}
