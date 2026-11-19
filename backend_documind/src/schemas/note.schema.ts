import { z } from "zod";

// Mensajes en español: el frontend los muestra tal cual en la lista de detalles del 400
const title = z
  .string({ error: "El título es obligatorio" })
  .trim()
  .min(1, "El título es obligatorio")
  .max(80, "El título admite como máximo 80 caracteres");
const content = z.string().trim().max(1000, "El texto admite como máximo 1000 caracteres");
const pinned = z.boolean({ error: "pinned debe ser true o false" });

export const CreateNoteSchema = z
  .object({
    title,
    content: content.default(""),
    pinned: pinned.default(false)
  })
  .strict();

// PATCH: todos los campos opcionales, pero al menos uno
export const UpdateNoteSchema = z
  .object({ title, content, pinned })
  .partial()
  .strict()
  .refine(data => Object.keys(data).length > 0, { error: "Debes enviar al menos un campo para actualizar" });

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
