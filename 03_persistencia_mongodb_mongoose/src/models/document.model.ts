import { Schema, model, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  author: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"]
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true
    },
    author: {
      type: String,
      required: [true, "El autor es obligatorio"],
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    }
  },
  {
    timestamps: true // Inyecta y gestiona automáticamente createdAt y updatedAt
  }
);

export const DocumentModel = model<IDocument>("Document", documentSchema);
