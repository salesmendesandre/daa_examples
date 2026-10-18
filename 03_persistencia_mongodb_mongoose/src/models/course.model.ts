/* ============================================================================
 * EJERCICIOS: Sistema de Cursos Universitarios
 * Ej.2: Subdocumentos anidados (lessons) con esquema propio y sin _id.
 * Ej.3: Soft Delete transparente vía hook pre(/^find/).
 * ========================================================================== */

import { Schema, model, Document as MongooseDocument } from "mongoose";

interface ILesson {
  title: string;
  durationMinutes: number;
}

// EJERCICIO 2: subesquema de lección. _id:false porque es un dato ligero que
// no necesita identidad propia consultable — solo tiene sentido embebido
// dentro de su curso (mismo criterio de Embedding visto en el modelo de
// Document, con "tags").
const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: [1, "La duración mínima es 1 minuto"] }
  },
  { _id: false }
);

export interface ICourse extends MongooseDocument {
  code: string;
  title: string;
  credits: number;
  instructor: string;
  lessons: ILesson[];
  isArchived: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 12 },
    instructor: { type: String, required: true },
    lessons: { type: [lessonSchema], default: [] },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// EJERCICIO 3: Soft Delete transparente. Si la query NO pregunta explícitamente
// por isArchived, se asume que quiere solo los activos (isArchived: false).
// Así CourseModel.find() "normal" nunca ve archivados sin tener que acordarse
// de excluirlos en cada controlador.
courseSchema.pre(/^find/, function (this: any, next) {
  const queryFilter = this.getQuery();
  if (queryFilter.isArchived === undefined) {
    this.where({ isArchived: false });
  }
  next();
});

export const CourseModel = model<ICourse>("Course", courseSchema);
