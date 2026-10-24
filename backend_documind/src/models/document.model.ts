import { Schema, model, InferSchemaType } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150
    },
    content: {
      type: String,
      required: true,
      minlength: 10
    },
    authorId: {
      type: String,
      required: true,
      index: true
    },
    authorName: {
      type: String,
      required: true
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
    },
    embedding: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

DocumentSchema.index({ title: "text", content: "text" });

export type IDocument = InferSchemaType<typeof DocumentSchema>;
export const DocumentModel = model<IDocument>("Document", DocumentSchema);
