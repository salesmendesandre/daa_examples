import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z.string().trim().min(3).max(150),
  content: z.string().min(10),
  tags: z.array(z.string().trim().toLowerCase()).default(["general"]),
  status: z.enum(["draft", "published", "archived"]).default("draft")
});

// Actualización parcial (PATCH): todos los campos opcionales y sin valores por defecto,
// para no sobrescribir lo que el cliente no envía.
export const UpdateDocumentSchema = z
  .object({
    title: z.string().trim().min(3).max(150),
    content: z.string().min(10),
    tags: z.array(z.string().trim().toLowerCase()),
    status: z.enum(["draft", "published", "archived"])
  })
  .partial()
  .strict()
  .refine(data => Object.keys(data).length > 0, { error: "Debes enviar al menos un campo para actualizar" });

export const DocumentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional()
});

export const RagQuerySchema = z.object({
  question: z.string().trim().min(3, "La pregunta debe tener al menos 3 caracteres"),
  topK: z.coerce.number().int().min(1).max(10).default(3)
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;
export type DocumentQueryInput = z.infer<typeof DocumentQuerySchema>;
export type RagQueryInput = z.infer<typeof RagQuerySchema>;
