/* ============================================================================
 * EJERCICIOS: Validación Estricta con Regex/Coerción (Ej.1) y Refinamiento
 * Condicional con .refine() (Ej.2) — Sistema de Transferencias Bancarias.
 * ========================================================================== */

import { z } from "zod";

const IBAN_ES_REGEX = /^ES\d{22}$/;

// EJERCICIO 1
export const CreateTransferSchema = z.object({
  sourceIban: z
    .string()
    .trim()
    .regex(IBAN_ES_REGEX, "El IBAN de origen debe ser un IBAN español válido (ES seguido de 22 dígitos)"),
  targetIban: z
    .string()
    .trim()
    .regex(IBAN_ES_REGEX, "El IBAN de destino debe ser un IBAN español válido"),
  amount: z
    .number({ required_error: "El importe es obligatorio" })
    .min(0.01, "El importe mínimo de transferencia es 0.01")
    .max(50000, "El importe máximo permitido por transferencia ordinaria es 50.000 €"),
  currency: z.enum(["EUR", "USD", "GBP"]).default("EUR"),
  concept: z
    .string({ required_error: "El concepto es obligatorio" })
    .trim()
    .min(5, "El concepto debe tener al menos 5 caracteres")
    .max(100, "El concepto no puede exceder 100 caracteres")
});

// EJERCICIO 2: reglas de negocio que cruzan varios campos -> no se pueden
// expresar declarando cada campo por separado, necesitan .refine() sobre el objeto completo.
export const CompliantTransferSchema = CreateTransferSchema.extend({
  complianceCode: z.string().trim().optional()
})
  .refine(data => data.sourceIban !== data.targetIban, {
    message: "El IBAN de origen y el de destino no pueden ser el mismo",
    path: ["targetIban"]
  })
  .refine(
    data => {
      if (data.amount >= 10000) {
        return typeof data.complianceCode === "string" && data.complianceCode.length >= 8;
      }
      return true;
    },
    {
      message: "Para transferencias iguales o superiores a 10.000 € es obligatorio aportar un 'complianceCode' válido (mínimo 8 caracteres)",
      path: ["complianceCode"]
    }
  );

export type CompliantTransferInput = z.infer<typeof CompliantTransferSchema>;
