/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Contrato de entrada de register/login (Zod)
 * Lo mismo que en el capítulo de validación: el body se valida en la frontera
 * (antes del controlador) y el DTO se infiere del schema con z.infer.
 * .toLowerCase() en el email -> "Admin@USAL.es" y "admin@usal.es" son el
 * mismo usuario, sin que el servicio tenga que acordarse de normalizarlo.
 * ========================================================================== */

import { z } from "zod";
import { USER_ROLES } from "../types/auth.types.js";

const emailField = z
  .string({ required_error: "El email es obligatorio" })
  .trim()
  .toLowerCase()
  .email("El email no tiene un formato válido");

const passwordField = z
  .string({ required_error: "La contraseña es obligatoria" })
  .min(1, "La contraseña es obligatoria");

export const RegisterSchema = z.object({
  email: emailField,
  password: passwordField,
  fullName: z
    .string({ required_error: "El nombre completo es obligatorio" })
    .trim()
    .min(2, "El nombre completo debe tener al menos 2 caracteres"),
  // OJO (chuleta): en un sistema real el cliente NUNCA elige su propio rol
  // al registrarse (cualquiera se haría admin). Se permite aquí solo para
  // poder probar el RBAC de /api/admin/metrics en clase.
  role: z.enum(USER_ROLES).default("user")
});

export const LoginSchema = z.object({
  email: emailField,
  password: passwordField
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
