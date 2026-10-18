/* ============================================================================
 * CAPA DE SERVICIO — Transferencias Bancarias
 * EJERCICIO 3: InsufficientBalanceError (422) / AccountBlockedError (403),
 * antes de tocar el saldo: la validación de FORMATO (Zod, en las rutas) y la
 * de NEGOCIO (cuentas) son dos capas distintas y se comprueban en ese orden.
 * ========================================================================== */

import { accountStore } from "../models/account.store.js";
import { TransferRecord } from "../types/transfer.types.js";
import { CompliantTransferInput } from "../schemas/transfer.schema.js";
import { InsufficientBalanceError, AccountBlockedError } from "../errors/transfer.errors.js";

export class TransfersService {
  executeTransfer(input: CompliantTransferInput): TransferRecord {
    const { sourceIban, targetIban, amount, currency, concept } = input;
    const account = accountStore.findByIban(sourceIban);

    if (account?.blocked) {
      throw new AccountBlockedError(sourceIban);
    }
    if (account && account.balance < amount) {
      throw new InsufficientBalanceError(account.balance, amount);
    }

    if (account) {
      accountStore.debit(sourceIban, amount);
    }

    return {
      id: crypto.randomUUID(),
      sourceIban,
      targetIban,
      amount,
      currency,
      concept,
      createdAt: new Date().toISOString()
    };
  }
}

export const transfersService = new TransfersService();
