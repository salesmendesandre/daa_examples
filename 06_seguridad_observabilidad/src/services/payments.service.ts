/* ============================================================================
 * CAPA DE SERVICIO — Payments
 * NOTA — por qué NO hay models/payment.store.ts en este dominio: el ejercicio
 * no pide guardar un historial de cargos, solo procesarlos y devolver la
 * confirmación, igual que una pasarela de pago real que delega la
 * persistencia a otro sistema (el banco emisor, un ledger externo...).
 * ========================================================================== */

import { PaymentCharge } from "../types/payment.types.js";
import { AppError } from "../errors/app.error.js";

export class PaymentsService {
  charge(amount: unknown, currency: unknown): PaymentCharge {
    if (typeof amount !== "number" || amount <= 0) {
      throw new AppError("El campo 'amount' debe ser un número positivo", 400);
    }
    if (currency !== "EUR" && currency !== "USD") {
      throw new AppError("El campo 'currency' debe ser 'EUR' o 'USD'", 400);
    }

    return {
      id: crypto.randomUUID(),
      amount,
      currency,
      status: "approved",
      createdAt: new Date().toISOString()
    };
  }
}

export const paymentsService = new PaymentsService();
