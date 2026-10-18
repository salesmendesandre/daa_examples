/* ============================================================================
 * CAPA DE CONTROLADOR — Currículums y Candidaturas (EJERCICIOS)
 * ========================================================================== */

import { Request, Response } from "express";
import { extractTextFromPdfBuffer } from "../services/pdf.service.js";
import { extractSkillsFromResumeText } from "../services/skills.service.js";
import { UploadCvDTO } from "../schemas/resume.schema.js";
import { UploadedFileInfo } from "../types/resume.types.js";
import { MissingFileError } from "../errors/upload.errors.js";

// EJERCICIOS 1 y 3: cuando se llega aquí, verifyPdfMagicBytes ya ha
// comprobado la firma binaria y UploadCvSchema ya ha convertido "skills".
export const uploadCv = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new MissingFileError("Debe proporcionar un archivo PDF en el campo 'cv'");
  }

  const { text, numPages } = await extractTextFromPdfBuffer(req.file.buffer);
  const { skills: expectedSkills } = req.body as UploadCvDTO;
  const { foundSkills, matchScore } = extractSkillsFromResumeText(text, expectedSkills);

  res.status(201).json({
    status: "success",
    message: "CV procesado con éxito",
    fileInfo: { originalName: req.file.originalname, sizeBytes: req.file.size, numPages },
    skills: { expected: expectedSkills, found: foundSkills, matchScore }
  });
};

// EJERCICIO 2: hasta 3 archivos en el campo "attachments" (3MB cada uno).
// (uploadAttachments es el middleware de Multer, en config/multerAttachments.ts)
export const receiveAttachments = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    throw new MissingFileError("Debe adjuntar al menos 1 archivo en el campo 'attachments'");
  }

  const attachments: UploadedFileInfo[] = files.map(f => ({ originalName: f.originalname, sizeBytes: f.size }));

  res.status(201).json({
    status: "success",
    message: `${files.length} documento(s) recibido(s) correctamente`,
    attachments
  });
};
