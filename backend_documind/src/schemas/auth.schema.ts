import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Correo electrónico no válido")),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  fullName: z.string().trim().min(2, "El nombre completo es requerido")
  // Sin campo "role": el registro público crea siempre usuarios "user". Si el cliente envía
  // un rol, Zod lo descarta (z.object elimina las claves desconocidas). Los administradores
  // se crean desde la base de datos o con los datos de demostración (src/data/seed.ts).
});

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Correo electrónico no válido")),
  password: z.string().min(1, "La contraseña es requerida")
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
