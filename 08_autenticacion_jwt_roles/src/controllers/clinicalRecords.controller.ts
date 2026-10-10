/* ============================================================================
 * CAPA DE CONTROLADOR — Historiales Clínicos (EJERCICIOS)
 * ========================================================================== */

import { Request, Response } from "express";
import { clinicalRecordsService } from "../services/clinicalRecords.service.js";
import { HospitalTokenPayload } from "../types/hospital.types.js";

// EJERCICIO 1
export const getAuditReport = (_req: Request, res: Response) => {
  res.json({ status: "success", data: clinicalRecordsService.getAuditReport() });
};

export const createRecord = (req: Request, res: Response) => {
  const record = clinicalRecordsService.createRecord(req.body);
  res.status(201).json({ status: "success", data: record });
};

// EJERCICIO 2
export const getClinicalRecordById = (req: Request, res: Response) => {
  // req.user está tipado con el payload de "Users" (contenido), pero aquí
  // llega un token del Hospital (ver nota en auth.middleware.ts) -> cast.
  const currentUser = req.user as unknown as HospitalTokenPayload;
  const record = clinicalRecordsService.getClinicalRecordForUser(String(req.params.id), currentUser);
  res.json({ status: "success", data: record });
};
