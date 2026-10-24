import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: `Ruta inexistente: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err }, "Error capturado en manejador centralizado");

  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    error: err.message || "Error interno del servidor"
  });
};
