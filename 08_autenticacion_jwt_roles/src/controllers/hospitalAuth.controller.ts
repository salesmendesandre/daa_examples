/* ============================================================================
 * CAPA DE CONTROLADOR — Auth del dominio Hospital (EJERCICIOS)
 * ========================================================================== */

import { Request, Response } from "express";
import { hospitalAuthService } from "../services/hospitalAuth.service.js";

export const registerHospitalUser = async (req: Request, res: Response) => {
  const { token, user } = await hospitalAuthService.register(req.body);
  res.status(201).json({ status: "success", token, user });
};

export const loginHospitalUser = async (req: Request, res: Response) => {
  const { token, user } = await hospitalAuthService.login(req.body);
  res.json({ status: "success", token, user });
};
