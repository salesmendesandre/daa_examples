/* ============================================================================
 * CAPA DE CONTROLADOR — Transfers
 * ========================================================================== */

import { Request, Response } from "express";
import { transfersService } from "../services/transfers.service.js";

export const createTransfer = (req: Request, res: Response) => {
  const transfer = transfersService.executeTransfer(req.body);
  res.status(201).json({ status: "success", data: transfer });
};
