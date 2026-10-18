import { app } from "./app.js";

const PORT = process.env.PORT || 3003;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[Validación Zod] Servidor escuchando en http://localhost:${PORT}`);
  });
}
