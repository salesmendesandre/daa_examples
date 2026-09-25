import express from "express";
import { validateBody } from "./middlewares/validate.middleware.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";
import { CreateDocumentSchema } from "./schemas/document.schema.js";

export const app = express();

app.use(express.json());

// Endpoint protegido por el middleware de validación:
app.post("/api/documents", validateBody(CreateDocumentSchema), (req, res) => {
  res.status(201).json({
    status: "success",
    message: "Documento validado e insertado correctamente",
    data: req.body
  });
});

// Captura de rutas inexistentes y manejador global de errores (siempre al final, en este orden):
app.use(notFoundHandler);
app.use(globalErrorHandler);
