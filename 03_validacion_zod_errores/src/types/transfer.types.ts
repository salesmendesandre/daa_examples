/* ============================================================================
 * TIPOS DE DOMINIO — Cuentas y Transferencias
 * Account: son datos de demostración cargados en el servidor, el cliente
 * nunca los envía -> no hay (ni tiene sentido que haya) un schema Zod que
 * los describa. TransferRecord: el comprobante que devolvemos incluye "id" y
 * "createdAt" generados por el servidor, igual que con Documents -> tampoco
 * es un simple z.infer del schema de entrada (CompliantTransferSchema, en
 * ../schemas/transfer.schema.ts). Por eso ambos viven aquí, en types/.
 * ========================================================================== */

export interface Account {
  balance: number;
  blocked: boolean;
}

export interface TransferRecord {
  id: string;
  sourceIban: string;
  targetIban: string;
  amount: number;
  currency: string;
  concept: string;
  createdAt: string;
}
