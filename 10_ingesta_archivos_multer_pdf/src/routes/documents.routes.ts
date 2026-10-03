/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Endpoint de Ingesta y Procesamiento (/api/documents)
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Multer (uploadPdf) es un middleware más de la cadena: parsea
 * el multipart/form-data y deja el archivo en req.file antes del controlador.
 * ========================================================================== */

import { Router } from "express";
import { uploadPdf } from "../config/multer.js";
import { uploadDocument } from "../controllers/documents.controller.js";

const router = Router();

router.post("/upload", uploadPdf.single("file"), uploadDocument);

export default router;
