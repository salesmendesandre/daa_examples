/* ============================================================================
 * HEREDADO DE SEMANA 4 — Manejador Centralizado de Errores
 * En Express 5, un error lanzado en un handler async (o pasado a next(err))
 * llega SIEMPRE aquí. Orden de comprobación importa: MulterError (NUEVO de
 * este capítulo), luego ZodError (400 estructurado con detalles por campo),
 * luego AppError (y sus subclases: InvalidFileTypeError=400... se resuelven
 * solas por su propio statusCode), y cualquier otra cosa cae en 500 genérico.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "../errors/app.error.js";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    error: "NotFound",
    message: `Ruta inexistente: ${req.method} ${req.originalUrl}`
  });
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // CONTENIDO DE LA SESIÓN: Multer corta la subida al superar los "limits"
  // (LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, LIMIT_UNEXPECTED_FILE...) y lanza un
  // MulterError -> se traduce a un 400 legible en vez de un 500 sin formato.
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      error: err.code,
      message: err.message
    });
  }

  if (err instanceof ZodError) {
    const issues = err.issues.map(issue => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    return res.status(400).json({
      status: "fail",
      error: "ValidationError",
      message: "Los datos de la petición no satisfacen el contrato de validación.",
      details: issues
    });
  }

  // JSON mal formado: express.json() lanza un SyntaxError con status 400. Sin
  // este caso caería en el 500 genérico de abajo (es un error del CLIENTE).
  if (err instanceof SyntaxError && (err as any).type === "entity.parse.failed") {
    return res.status(400).json({
      status: "fail",
      error: "InvalidJSON",
      message: "El cuerpo de la petición no es un JSON válido."
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? "error" : "fail",
      error: err.name,
      message: err.message
    });
  }

  console.error("Excepción no controlada:", err);

  return res.status(500).json({
    status: "error",
    error: "InternalServerError",
    message: "Ha ocurrido un error inesperado en el servidor.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
