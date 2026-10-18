/* ============================================================================
 * EJERCICIOS — Contrato de entrada para crear un historial clínico
 * ========================================================================== */

import { z } from "zod";

export const CreateClinicalRecordSchema = z.object({
  patientId: z
    .string({ required_error: "El campo 'patientId' es obligatorio" })
    .trim()
    .min(1, "El campo 'patientId' es obligatorio"),
  doctorAssignedId: z
    .string({ required_error: "El campo 'doctorAssignedId' es obligatorio" })
    .trim()
    .min(1, "El campo 'doctorAssignedId' es obligatorio"),
  diagnosis: z
    .string({ required_error: "El campo 'diagnosis' es obligatorio" })
    .trim()
    .min(3, "El diagnóstico debe tener al menos 3 caracteres"),
  prescriptions: z.array(z.string().trim()).optional().default([]),
  confidentialNotes: z.string().trim().optional()
});

export type CreateClinicalRecordDTO = z.infer<typeof CreateClinicalRecordSchema>;
