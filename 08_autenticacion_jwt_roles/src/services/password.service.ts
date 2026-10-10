/* ============================================================================
 * EJERCICIO 3 — Verificación de Contraseña Segura con Regex y Bcrypt
 * La regex (utils/strongPassword.ts) se comprueba ANTES de invertir tiempo de
 * CPU en bcrypt (factor de coste 12, más alto que el 10 del registro genérico
 * -> más lento a propósito, para un dominio de alta sensibilidad como
 * historiales médicos). Si no la cumple: WeakPasswordError -> 400.
 * ========================================================================== */

import bcrypt from "bcrypt";
import { isStrongPassword } from "../utils/strongPassword.js";
import { WeakPasswordError } from "../errors/auth.errors.js";

export class PasswordService {
  async hashStrongPassword(password: string): Promise<string> {
    if (!isStrongPassword(password)) {
      throw new WeakPasswordError();
    }

    return bcrypt.hash(password, 12);
  }
}

export const passwordService = new PasswordService();
