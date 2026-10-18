// Forma del body que llega en POST /api/courses. No es el documento
// persistido (eso es ICourse, en models/course.model.ts): aquí no hay _id,
// isArchived, createdAt ni updatedAt porque esos campos los pone Mongoose o
// el propio servicio, nunca el cliente.

import { ICourse } from "../models/course.model.js";

export interface CreateCourseInput {
  code: string;
  title: string;
  credits: number;
  instructor: string;
  lessons?: ICourse["lessons"];
}
