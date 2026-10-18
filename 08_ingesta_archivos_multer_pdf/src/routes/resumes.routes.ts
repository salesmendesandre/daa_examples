/* ============================================================================
 * EJERCICIOS: Plataforma de Currículums y Candidaturas (/api/resumes)
 * Ej.1 -> verifyPdfMagicBytes justo después de Multer.
 * Ej.2 -> uploadAttachments (hasta 3 archivos, 3MB c/u).
 * Ej.3 -> UploadCvSchema convierte "skills" y el controlador calcula la afinidad.
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí (ver controllers/resumes.controller.ts).
 * ========================================================================== */

import { Router } from "express";
import { uploadPdf } from "../config/multer.js";
import { uploadAttachments } from "../config/multerAttachments.js";
import { verifyPdfMagicBytes } from "../middlewares/verifyPdfMagicBytes.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { UploadCvSchema } from "../schemas/resume.schema.js";
import { uploadCv, receiveAttachments } from "../controllers/resumes.controller.js";

const router = Router();

// EJERCICIO 1: multer -> verifyPdfMagicBytes -> (Zod de los campos de texto)
// -> controlador, en ese orden exacto: sin multer no hay buffer que mirar.
router.post("/upload-cv", uploadPdf.single("cv"), verifyPdfMagicBytes, validateBody(UploadCvSchema), uploadCv);

// EJERCICIO 2: Multer limita nº y tamaño; verifyPdfMagicBytes comprueba que
// TODOS los adjuntos son PDFs legítimos (no solo que lo declaren).
router.post("/upload-attachments", uploadAttachments, verifyPdfMagicBytes, receiveAttachments);

export default router;
