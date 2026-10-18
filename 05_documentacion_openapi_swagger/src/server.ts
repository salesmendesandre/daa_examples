import { app } from "./app.js";

const PORT = process.env.PORT || 3004;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[OpenAPI] Swagger UI interactivo disponible en http://localhost:${PORT}/api/docs`);
  });
}
