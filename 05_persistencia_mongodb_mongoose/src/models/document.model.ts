import { Schema, model, InferSchemaType } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "Mínimo 3 caracteres"],
      maxlength: [120, "Máximo 120 caracteres"]
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      minlength: [10, "Mínimo 10 caracteres"]
    },
    author: {
      type: String,
      required: [true, "El autor es obligatorio"],
      trim: true
    },
    tags: {
      type: [String],
      default: ["general"],
      index: true
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índice compuesto de texto completo para búsquedas léxicas
DocumentSchema.index({ title: "text", content: "text" });

export type IDocument = InferSchemaType<typeof DocumentSchema>;
export const DocumentModel = model<IDocument>("Document", DocumentSchema);
