/* ============================================================================
 * EJERCICIOS — Contrato de entrada del registro del Hospital (Zod)
 * Aquí "role" es OBLIGATORIO y solo admite los roles del hospital.
 * La FORTALEZA de la contraseña NO se valida aquí a propósito: es el
 * Ejercicio 3 y vive en services/password.service.ts (regex + bcrypt 12).
 * El login del Hospital reutiliza LoginSchema (../schemas/auth.schema.ts).
 * ========================================================================== */

import { z } from "zod";
import { HOSPITAL_ROLES } from "../types/hospital.types.js";

export const HospitalRegisterSchema = z.object({
  email: z
    .string({ required_error: "El email es obligatorio" })
    .trim()
    .toLowerCase()
    .email("El email no tiene un formato válido"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria"),
  fullName: z
    .string({ required_error: "El nombre completo es obligatorio" })
    .trim()
    .min(2, "El nombre completo debe tener al menos 2 caracteres"),
  role: z.enum(HOSPITAL_ROLES, {
    errorMap: () => ({ message: `El rol debe ser uno de: ${HOSPITAL_ROLES.join(", ")}` })
  })
});

export type HospitalRegisterDTO = z.infer<typeof HospitalRegisterSchema>;
