/* ============================================================================
 * EJERCICIOS — Registro/Login del dominio Hospital
 * Igual que auth.service.ts, pero el hash pasa por hashStrongPassword
 * (Ejercicio 3): una contraseña débil se rechaza con 400 ANTES de llegar
 * a bcrypt.
 * ========================================================================== */

import bcrypt from "bcrypt";
import { hospitalUserStore } from "../models/hospitalUser.store.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import { HospitalAuthResult, HospitalUserEntity } from "../types/hospital.types.js";
import { HospitalRegisterDTO } from "../schemas/hospitalAuth.schema.js";
import { LoginDTO } from "../schemas/auth.schema.js";
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from "../errors/auth.errors.js";

export class HospitalAuthService {
  async register(input: HospitalRegisterDTO): Promise<HospitalAuthResult> {
    if (hospitalUserStore.findByEmail(input.email)) {
      throw new EmailAlreadyRegisteredError();
    }

    // EJERCICIO 3: lanza WeakPasswordError (400) si no cumple la política.
    const passwordHash = await passwordService.hashStrongPassword(input.password);

    const user = hospitalUserStore.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      role: input.role
    });

    return this.buildAuthResult(user);
  }

  async login({ email, password }: LoginDTO): Promise<HospitalAuthResult> {
    const user = hospitalUserStore.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) throw new InvalidCredentialsError();

    return this.buildAuthResult(user);
  }

  private buildAuthResult({ passwordHash, ...user }: HospitalUserEntity): HospitalAuthResult {
    const token = tokenService.generateToken({ userId: user.id, email: user.email, role: user.role });
    return { token, user };
  }
}

export const hospitalAuthService = new HospitalAuthService();
