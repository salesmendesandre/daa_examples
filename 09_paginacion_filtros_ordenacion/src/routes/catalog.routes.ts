/* ============================================================================
 * EJERCICIOS (punto 5): Catálogo de Productos y Moda (/api/catalog)
 * Une los 3 ejercicios en un único endpoint: valida (Ej.1, aquí) -> filtra
 * (Ej.2) -> pagina -> construye enlaces (Ej.3), en services/catalog.service.ts.
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middleware de
 * validación -> controlador. Cero lógica aquí.
 * ========================================================================== */

import { Router } from "express";
import { validateQuery } from "../middlewares/validate.middleware.js";
import { CatalogQuerySchema } from "../schemas/catalog.schema.js";
import { getCatalog } from "../controllers/catalog.controller.js";

const router = Router();

// EJERCICIO 1: un query string inválido (?minPrice=100&maxPrice=10,
// ?limit=500, ?sort=$where...) se corta aquí con un 400 antes de tocar MongoDB.
router.get("/", validateQuery(CatalogQuerySchema), getCatalog);

export default router;
