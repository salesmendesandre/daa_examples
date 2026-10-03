/* ============================================================================
 * CAPA DE CONTROLADOR — Ingesta de Documentos PDF (CONTENIDO)
 * Multer (en la ruta) ya ha dejado el archivo en req.file.buffer. El
 * controlador comprueba que llegó, delega la extracción en el servicio
 * (que solo recibe un Buffer, nada de Express) y monta la respuesta.
 * ========================================================================== */

import { Request, Response } from "express";
import { extractTextFromPdfBuffer } from "../services/pdf.service.js";
import { MissingFileError } from "../errors/upload.errors.js";

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new MissingFileError("Debe proporcionar un archivo PDF en el campo 'file'");
  }

  const { text, numPages } = await extractTextFromPdfBuffer(req.file.buffer);

  res.status(201).json({
    status: "success",
    message: "PDF procesado con éxito",
    fileInfo: {
      originalName: req.file.originalname,
      sizeBytes: req.file.size,
      numPages,
      extractedLength: text.length
    },
    preview: text.slice(0, 200) + (text.length > 200 ? "..." : "")
  });
};
