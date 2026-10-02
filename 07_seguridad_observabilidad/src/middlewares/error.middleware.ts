/* ============================================================================
 * Manejador Centralizado de Errores (ver capítulo 3). Se reutiliza aquí para
 * que los errores de Payments (AppError) y las rutas inexistentes respondan
 * con el mismo formato JSON que el resto de la API.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
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
