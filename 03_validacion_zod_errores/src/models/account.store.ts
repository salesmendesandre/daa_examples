/* ============================================================================
 * CAPA DE MODELO — Cuentas bancarias de demostración
 * Nota: el "modelo" de este dominio son las CUENTAS, no las transferencias:
 * no persistimos un historial de transferencias (el ejercicio no lo pide),
 * solo el saldo/estado de cada cuenta, que sí necesita sobrevivir entre
 * peticiones para que el saldo se descuente de verdad entre llamadas.
 * ========================================================================== */

import { Account } from "../types/transfer.types.js";

class AccountStore {
  // Cuentas de demostración: usa estos IBAN en las peticiones de prueba.
  private accounts: Record<string, Account> = {
    "ES1234567890123456789012": { balance: 500, blocked: false },
    "ES9999999999999999999999": { balance: 200000, blocked: true },
    "ES1111111111111111111111": { balance: 5, blocked: false }
  };

  findByIban(iban: string): Account | undefined {
    return this.accounts[iban];
  }

  debit(iban: string, amount: number): void {
    const account = this.accounts[iban];
    if (account) {
      account.balance -= amount;
    }
  }
}

export const accountStore = new AccountStore();
