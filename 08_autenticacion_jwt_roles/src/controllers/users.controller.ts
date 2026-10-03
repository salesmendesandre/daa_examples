/* ============================================================================
 * CAPA DE CONTROLADOR — Users (CONTENIDO)
 * req.user lo ha rellenado authenticateToken con el payload del JWT: el id
 * del usuario sale del TOKEN, nunca de la URL ni del body (el cliente no
 * puede pedir "el perfil de otro" cambiando un parámetro).
 * ========================================================================== */

import { Request, Response } from "express";
import { usersService } from "../services/users.service.js";

export const getMe = (req: Request, res: Response) => {
  const user = usersService.getProfile(req.user!.userId);
  res.json({ status: "success", data: user });
};
