/* ============================================================================
 * EJERCICIOS: Sistema de Cursos Universitarios
 * Mismo patrón async/await que documents.controller.ts, aplicado a un dominio
 * independiente con dos particularidades: subdocumentos y soft delete.
 * ========================================================================== */

import { Request, Response } from "express";
import { coursesService } from "../services/courses.service.js";

// Sin filtro: coursesService ya delega en el hook pre(/^find/) del modelo,
// que excluye isArchived:true. Con ?isArchived=true: se pasa explícito, así
// que el hook NO lo sobrescribe y sí devuelve los archivados (demuestra el
// "a menos que se especifique explícitamente" del enunciado del Ejercicio 3).
export const getAllCourses = async (req: Request, res: Response) => {
  const isArchived = req.query.isArchived !== undefined ? req.query.isArchived === "true" : undefined;

  const courses = await coursesService.getAllCourses(isArchived);
  res.json({ status: "success", count: courses.length, data: courses });
};

// EJERCICIO 1: esta ruta va montada detrás de validateObjectId("id") — si
// llegamos aquí, el :id YA es un ObjectId sintácticamente válido.
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await coursesService.getCourseById(req.params.id as string);
    res.json({ status: "success", data: course });
  } catch (err: any) {
    if (err.message?.startsWith("COURSE_NOT_FOUND")) {
      return res.status(404).json({ status: "fail", message: "Curso no encontrado" });
    }
    throw err;
  }
};

// EJERCICIO 2: "lessons" viaja en el body como array de subdocumentos y
// Mongoose los valida uno a uno contra lessonSchema (title/durationMinutes).
export const createCourse = async (req: Request, res: Response) => {
  const { code, title, credits, instructor, lessons } = req.body;
  const course = await coursesService.createCourse({ code, title, credits, instructor, lessons });
  res.status(201).json({ status: "success", data: course });
};

// EJERCICIO 3: DELETE no borra el documento — lo archiva (isArchived: true).
// A partir de ahí, CourseModel.find() deja de verlo automáticamente.
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    await coursesService.deleteCourse(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    if (err.message?.startsWith("COURSE_NOT_FOUND")) {
      return res.status(404).json({ status: "fail", message: "Curso no encontrado" });
    }
    throw err;
  }
};
