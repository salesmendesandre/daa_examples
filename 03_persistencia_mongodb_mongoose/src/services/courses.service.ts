/* ============================================================================
 * EJERCICIOS: Sistema de Cursos Universitarios
 * Mismo patrón que documents.service.ts. El soft delete (archivar en vez de
 * borrar) es una decisión de negocio, así que vive aquí y no en el modelo:
 * el modelo solo sabe persistir y, vía su hook, ocultar lo archivado.
 * ========================================================================== */

import { CourseModel } from "../models/course.model.js";
import { CreateCourseInput } from "../types/course.types.js";

export class CoursesService {
  async getAllCourses(isArchived?: boolean) {
    const filter: any = {};
    if (isArchived !== undefined) {
      filter.isArchived = isArchived;
    }
    return CourseModel.find(filter).exec();
  }

  async getCourseById(id: string) {
    const course = await CourseModel.findById(id).exec();
    if (!course) {
      throw new Error(`COURSE_NOT_FOUND:${id}`);
    }
    return course;
  }

  async createCourse(input: CreateCourseInput) {
    return CourseModel.create(input);
  }

  // Archivar en vez de borrar: el registro se conserva (historial, integridad
  // referencial con matrículas pasadas, etc.) pero deja de aparecer en find().
  async deleteCourse(id: string) {
    const archived = await CourseModel.findByIdAndUpdate(id, { isArchived: true }, { new: true }).exec();
    if (!archived) {
      throw new Error(`COURSE_NOT_FOUND:${id}`);
    }
  }
}

export const coursesService = new CoursesService();
