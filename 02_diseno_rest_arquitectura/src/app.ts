import express from "express";
import documentsRoutes from "./routes/documents.routes.js";

export const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Registro de rutas modulares
app.use("/api/documents", documentsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "DocuMind Layered API" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[Layered API] Servidor escuchando en http://localhost:${PORT}`);
  });
}
