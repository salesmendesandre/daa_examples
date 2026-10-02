/* ============================================================================
 * EJERCICIOS: Catálogo de Libros (/api/books)
 * La implementación real de lo que promete src/docs/openapi.json:
 * Ej.1 -> GET /books/{isbn} con 200/404.
 * Ej.2 -> forma de "Book"/"CreateBookPayload" (ver book.schema.ts).
 * Ej.3 -> POST /books protegido con bearerAuth (botón Authorize en Swagger UI).
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí (ver services/books.service.ts).
 * ========================================================================== */

import { Router } from "express";
import { CreateBookSchema } from "../schemas/book.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { requireBearerToken } from "../middlewares/requireBearerToken.js";
import { getAllBooks, getBookByIsbn, createBook } from "../controllers/books.controller.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:isbn", getBookByIsbn);

// EJERCICIO 3: requireBearerToken va ANTES de validateBody -> primero se
// comprueba quién eres, luego si lo que envías tiene sentido.
router.post("/", requireBearerToken, validateBody(CreateBookSchema), createBook);

export default router;
