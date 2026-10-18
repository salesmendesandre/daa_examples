/* ============================================================================
 * EJERCICIO 3: Excepciones Operacionales Personalizadas
 * Cada subclase fija su propio código HTTP en el constructor — el controlador
 * no decide el status code, solo el propio error sabe cuál le corresponde.
 * ========================================================================== */

import { AppError } from "./app.error.js";

export class InsufficientBalanceError extends AppError {
  constructor(currentBalance: number, requestedAmount: number) {
    super(
      `Saldo insuficiente en la cuenta. Saldo actual: ${currentBalance} €, Importe solicitado: ${requestedAmount} €`,
      422
    );
    this.name = "InsufficientBalanceError";
  }
}

export class AccountBlockedError extends AppError {
  constructor(iban: string) {
    super(`La cuenta ${iban} se encuentra bloqueada por motivos de seguridad o cumplimiento normativo.`, 403);
    this.name = "AccountBlockedError";
  }
}
