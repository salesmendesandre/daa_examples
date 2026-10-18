/* ============================================================================
 * CONTENIDO — Manejador Centralizado de Errores
 * En Express 5, un error lanzado en un handler async (o pasado a next(err))
 * llega SIEMPRE aquí. Orden de comprobación: ZodError primero (400
 * estructurado con detalles por campo), luego AppError (y sus subclases, que
 * se resuelven solas por su propio statusCode), y cualquier otra cosa cae en
 * un 500 genérico.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app.error.js";

// Captura cualquier ruta que no haya coincidido con ningún router anterior:
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
  // 1. Errores de validación de esquemas Zod (400 Bad Request):
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

  // 2. Errores operacionales personalizados derivados de AppError:
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? "error" : "fail",
      error: err.name,
      message: err.message
    });
  }

  // 3. Excepciones no controladas (500 Internal Server Error):
  console.error("❌ Excepción no controlada:", err);

  return res.status(500).json({
    status: "error",
    error: "InternalServerError",
    message: "Ha ocurrido un error inesperado en el servidor.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
