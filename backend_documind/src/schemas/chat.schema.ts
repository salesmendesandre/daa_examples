import { z } from "zod";

// Lo único que decide el cliente es el texto: el autor sale del JWT y la hora, del servidor.
export const ChatMessageSchema = z.object({
  text: z
    .string({ error: "El mensaje debe ser un texto" })
    .trim()
    .min(1, { error: "El mensaje no puede estar vacío" })
    .max(500, { error: "El mensaje no puede superar los 500 caracteres" })
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
