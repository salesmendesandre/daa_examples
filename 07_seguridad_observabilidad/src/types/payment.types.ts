/* ============================================================================
 * TIPOS DE DOMINIO — PaymentCharge
 * No hay schema Zod para el body de /charge (a diferencia de otros capítulos):
 * el ejercicio de este dominio es la SEGURIDAD (rate limiting, Helmet/CORS
 * reforzados en routes/payments.routes.ts), no la validación declarativa, así
 * que amount/currency se comprueban a mano en el servicio. Aun así, la FORMA
 * del cargo que devolvemos ("id"/"status"/"createdAt" los genera el servidor)
 * sigue necesitando su propia interface aquí, en types/.
 * ========================================================================== */

export interface PaymentCharge {
  id: string;
  amount: number;
  currency: "EUR" | "USD";
  status: "approved";
  createdAt: string;
}
