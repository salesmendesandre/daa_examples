import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { DocumentModel } from "../models/document.model.js";
import { computeEmbedding } from "../services/embedding.util.js";
import { logger } from "../config/logger.js";

/**
 * Datos de demostración para el bloque de Vue: dos usuarios con roles distintos y
 * documentos suficientes para probar la paginación, los filtros y los permisos
 * (un usuario solo puede editar o borrar sus propios documentos; el admin, todos).
 *
 * Credenciales SOLO para desarrollo local:
 *   admin@documind.test / Admin1234!   (rol admin)
 *   ana@documind.test   / Ana12345!    (rol user)
 *   luis@documind.test  / Luis12345!   (rol user)
 */
export const DEMO_USERS = [
  { email: "admin@documind.test", password: "Admin1234!", fullName: "Admin DocuMind", role: "admin" },
  { email: "ana@documind.test", password: "Ana12345!", fullName: "Ana García", role: "user" },
  { email: "luis@documind.test", password: "Luis12345!", fullName: "Luis Pérez", role: "user" }
] as const;

type DemoDocument = {
  title: string;
  content: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  author: (typeof DEMO_USERS)[number]["email"];
};

const DEMO_DOCUMENTS: DemoDocument[] = [
  { title: "Introducción a Express 5", content: "Express 5 gestiona automáticamente las promesas rechazadas en los manejadores asíncronos y las envía al middleware de errores.", tags: ["express", "node"], status: "published", author: "ana@documind.test" },
  { title: "Arquitectura en capas", content: "Separar rutas, controladores y servicios permite probar la lógica de negocio sin depender del protocolo HTTP.", tags: ["arquitectura", "rest"], status: "published", author: "ana@documind.test" },
  { title: "Modelado con Mongoose", content: "Los esquemas de Mongoose definen tipos, validaciones e índices; InferSchemaType deriva el tipo TypeScript del esquema.", tags: ["mongodb", "mongoose"], status: "published", author: "luis@documind.test" },
  { title: "Validación con Zod", content: "Zod valida los datos en la frontera de la API: si el cuerpo no cumple el esquema se responde 400 con el detalle de cada campo.", tags: ["zod", "validacion"], status: "published", author: "luis@documind.test" },
  { title: "Documentar con OpenAPI", content: "Un contrato OpenAPI permite generar documentación interactiva con Swagger UI y clientes tipados para el frontend.", tags: ["openapi", "documentacion"], status: "published", author: "ana@documind.test" },
  { title: "Cabeceras seguras con Helmet", content: "Helmet añade cabeceras como Content-Security-Policy o X-Frame-Options para que el navegador ayude a proteger la aplicación.", tags: ["seguridad", "helmet"], status: "published", author: "luis@documind.test" },
  { title: "Autenticación con JWT", content: "El servidor firma un token con el identificador y el rol del usuario; el cliente lo envía en la cabecera Authorization con el esquema Bearer.", tags: ["seguridad", "jwt"], status: "published", author: "ana@documind.test" },
  { title: "Subida de ficheros con Multer", content: "Multer procesa peticiones multipart/form-data y permite limitar el tamaño y validar el tipo de fichero antes de guardarlo.", tags: ["multer", "ficheros"], status: "published", author: "luis@documind.test" },
  { title: "Paginación con metadatos", content: "Devolver total, página actual y si hay página siguiente o anterior permite al frontend construir controles de paginación.", tags: ["paginacion", "rest"], status: "published", author: "ana@documind.test" },
  { title: "Tests de integración con Supertest", content: "Supertest levanta la aplicación en un puerto efímero y permite comprobar códigos de estado y cuerpos de respuesta.", tags: ["testing", "vitest"], status: "published", author: "luis@documind.test" },
  { title: "Búsqueda semántica", content: "Los embeddings representan el significado de un texto como un vector; la similitud coseno mide lo cerca que están dos textos.", tags: ["busqueda", "ia"], status: "published", author: "ana@documind.test" },
  { title: "Qué es RAG", content: "La generación aumentada por recuperación busca primero los fragmentos relevantes y los inyecta en el prompt del modelo.", tags: ["rag", "ia"], status: "published", author: "luis@documind.test" },
  { title: "Borrador: guía de despliegue", content: "Pendiente de completar: variables de entorno, build de producción y despliegue del frontend en GitHub Pages.", tags: ["despliegue"], status: "draft", author: "ana@documind.test" },
  { title: "Notas antiguas de Firebase", content: "El curso anterior usaba Firebase como backend; este año el frontend consume la API propia construida en el bloque de APIs.", tags: ["firebase"], status: "archived", author: "admin@documind.test" }
];

/** Inserta usuarios y documentos de demostración. Con `reset` borra antes los existentes. */
export const seedDemoData = async ({ reset = false } = {}): Promise<boolean> => {
  if (reset) {
    await Promise.all([DocumentModel.deleteMany({}), UserModel.deleteMany({})]);
  } else if ((await UserModel.estimatedDocumentCount()) > 0 || (await DocumentModel.estimatedDocumentCount()) > 0) {
    return false; // La base de datos ya tiene datos: no se toca.
  }

  const users = new Map<string, { id: string; fullName: string }>();
  for (const u of DEMO_USERS) {
    const created = await UserModel.create({
      email: u.email,
      passwordHash: await bcrypt.hash(u.password, 10),
      fullName: u.fullName,
      role: u.role
    });
    users.set(u.email, { id: String(created._id), fullName: created.fullName });
  }

  await DocumentModel.insertMany(
    DEMO_DOCUMENTS.map(d => ({
      title: d.title,
      content: d.content,
      tags: d.tags,
      status: d.status,
      authorId: users.get(d.author)!.id,
      authorName: users.get(d.author)!.fullName,
      embedding: computeEmbedding(`${d.title} ${d.content}`)
    }))
  );

  logger.info(`[Seed] Cargados ${DEMO_USERS.length} usuarios y ${DEMO_DOCUMENTS.length} documentos de demostración`);
  return true;
};
