/* ============================================================================
 * EJERCICIOS — Historias Clínicas Hospitalarias (/api/clinical-records)
 * Ej.1 -> requireHospitalRoles (RBAC flexible) en /admin/audit y en POST /.
 * Ej.2 -> GET /:id con Ownership/BOLA (ver services/clinicalRecords.service.ts).
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí.
 * ========================================================================== */

import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireHospitalRoles } from "../middlewares/requireHospitalRoles.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { CreateClinicalRecordSchema } from "../schemas/clinicalRecord.schema.js";
import { getAuditReport, createRecord, getClinicalRecordById } from "../controllers/clinicalRecords.controller.js";

const router = Router();

// Todas las rutas de este router requieren estar autenticado como mínimo.
router.use(authenticateToken);

// EJERCICIO 1: demo dedicada de requireHospitalRoles — solo hospital_admin.
// (declarada antes de "/:id" por precedencia de rutas, igual que en capítulos previos)
router.get("/admin/audit", requireHospitalRoles("hospital_admin"), getAuditReport);

// Creación de historiales: solo personal clínico (no pacientes). Primero se
// comprueba quién eres (rol) y luego si lo que envías es válido (Zod).
router.post("/", requireHospitalRoles("doctor", "hospital_admin"), validateBody(CreateClinicalRecordSchema), createRecord);

// EJERCICIO 2: autorización por titularidad (Ownership) + protección BOLA.
router.get("/:id", getClinicalRecordById);

export default router;
