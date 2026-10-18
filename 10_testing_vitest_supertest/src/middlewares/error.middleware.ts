/* ============================================================================
 * HEREDADO DE SEMANA 4 — Manejador Centralizado de Errores
 * En Express 5, un error lanzado en un handler async (o pasado a next(err))
 * llega SIEMPRE aquí. Orden de comprobación: ZodError (400 con detalles por
 * campo), luego AppError (p. ej. el 404 de un documento inexistente), y
 * cualquier otra cosa cae en 500 genérico SIN filtrar la traza al cliente
 * (sin este manejador, Express devolvía una página HTML con el stack trace y
 * las rutas del servidor).
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
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
