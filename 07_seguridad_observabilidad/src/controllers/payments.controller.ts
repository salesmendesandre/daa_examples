/* ============================================================================
 * CAPA DE CONTROLADOR — Payments
 * ========================================================================== */

import { Request, Response } from "express";
import { paymentsService } from "../services/payments.service.js";

export const createCharge = (req: Request, res: Response) => {
  const charge = paymentsService.charge(req.body.amount, req.body.currency);
  res.status(201).json({ status: "success", data: charge });
};
