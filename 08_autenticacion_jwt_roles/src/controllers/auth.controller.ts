/* ============================================================================
 * CAPA DE CONTROLADOR — Auth del dominio Users (CONTENIDO)
 * req.body ya llega validado por validateBody(RegisterSchema/LoginSchema).
 * Son async (bcrypt lo es): en Express 5, si el servicio lanza un error
 * (409, 401...), la promesa rechazada llega sola al globalErrorHandler.
 * ========================================================================== */

import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  const { token, user } = await authService.register(req.body);
  res.status(201).json({ status: "success", message: "Usuario registrado con éxito", token, user });
};

export const login = async (req: Request, res: Response) => {
  const { token, user } = await authService.login(req.body);
  res.json({ status: "success", token, user });
};
