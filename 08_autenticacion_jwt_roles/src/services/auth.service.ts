/* ============================================================================
 * CAPA DE SERVICIO — Registro y Login con Bcrypt (CONTENIDO)
 * bcrypt.hash(password, 10): genera una SAL aleatoria y aplica 2^10 rondas
 * (factor de coste 10) -> dos usuarios con la misma contraseña tienen hashes
 * distintos, y probar contraseñas por fuerza bruta es lento a propósito.
 * bcrypt.compare: vuelve a calcular el hash con la sal guardada y compara.
 * ========================================================================== */

import bcrypt from "bcrypt";
import { userStore } from "../models/user.store.js";
import { tokenService } from "./token.service.js";
import { toPublicUser } from "./users.service.js";
import { AuthResult, UserEntity } from "../types/auth.types.js";
import { RegisterDTO, LoginDTO } from "../schemas/auth.schema.js";
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from "../errors/auth.errors.js";

export class AuthService {
  async register(input: RegisterDTO): Promise<AuthResult> {
    if (userStore.findByEmail(input.email)) {
      throw new EmailAlreadyRegisteredError();
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = userStore.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      role: input.role
    });

    return this.buildAuthResult(user);
  }

  async login({ email, password }: LoginDTO): Promise<AuthResult> {
    // Mismo error si el email no existe o si la contraseña no coincide:
    // así un atacante no puede averiguar qué emails están registrados.
    const user = userStore.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) throw new InvalidCredentialsError();

    return this.buildAuthResult(user);
  }

  private buildAuthResult(user: UserEntity): AuthResult {
    const token = tokenService.generateToken({ userId: user.id, email: user.email, role: user.role });
    return { token, user: toPublicUser(user) };
  }
}

export const authService = new AuthService();
