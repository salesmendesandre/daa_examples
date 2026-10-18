/* ============================================================================
 * CONTENIDO — Definición Declarativa de Esquemas con Zod
 * z.infer<typeof Schema> = "Single Source of Truth": el tipo TypeScript se
 * deriva del esquema, no al revés (evita mantener duplicado interface + validación).
 * ========================================================================== */

import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z
    .string({ required_error: "El título es obligatorio" })
    .trim()
    .min(3, "El título debe contener al menos 3 caracteres")
    .max(120, "El título no puede superar los 120 caracteres"),
  content: z
    .string({ required_error: "El contenido es obligatorio" })
    .trim()
    .min(10, "El contenido debe tener al menos 10 caracteres"),
  author: z
    .string({ required_error: "El autor es obligatorio" })
    .trim()
    .min(2, "El nombre del autor debe tener al menos 2 caracteres"),
  // OJO: no encadenamos aquí un .min(1) — un mínimo de 1 elemento entra en
  // conflicto directo con .default([]): cualquier petición que omita "tags"
  // fallaría siempre, porque el propio valor por defecto incumpliría su
  // mínimo. "tags" es realmente opcional (de 0 a 10 etiquetas).
  tags: z
    .array(z.string().trim().toLowerCase())
    .max(10, "No se admiten más de 10 etiquetas")
    .optional()
    .default([])
});

// Actualización parcial: todos los campos se vuelven opcionales pero conservan sus reglas
export const UpdateDocumentSchema = CreateDocumentSchema.partial();

// Inferencia automática de tipos TypeScript:
export type CreateDocumentDTO = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentDTO = z.infer<typeof UpdateDocumentSchema>;
