import { Schema, model, InferSchemaType } from "mongoose";

// Notas: entidad sencilla y pública (sin autenticación) para practicar el CRUD
// completo desde el frontend antes de llegar a los documentos y al JWT.
const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    content: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },
    pinned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type INote = InferSchemaType<typeof NoteSchema>;
export const NoteModel = model<INote>("Note", NoteSchema);
