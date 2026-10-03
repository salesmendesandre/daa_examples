/* CONTENIDO DE LA SESIÓN — mismo modelo de Documents que en la Semana 3 */

import { Schema, model, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    content: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const DocumentModel = model<IDocument>("Document", documentSchema);
