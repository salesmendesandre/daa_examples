import { app } from "./app.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 3007;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`[Seguridad API] Servidor activo en http://localhost:${PORT}`);
  });
}
