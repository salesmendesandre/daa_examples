import "dotenv/config"; // Debe ir primero: carga .env antes de que los módulos lean process.env
import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { logger } from "./config/logger.js";
import { seedDemoData } from "./data/seed.js";
import { createRealtimeServer } from "./realtime/socket.js";

const PORT = process.env.PORT || 3013;

async function bootstrap() {
  await connectDB();
  if (process.env.SEED_DEMO_DATA !== "false") {
    await seedDemoData();
  }

  // Un único servidor HTTP para Express y Socket.IO (mismo puerto). `app` sigue exportándose
  // sin listen() desde app.ts, así que Supertest la usa sin arrancar nada.
  const httpServer = createServer(app);
  createRealtimeServer(httpServer);

  httpServer.listen(PORT, () => {
    logger.info(`[DocuMind Server] API corriendo en http://localhost:${PORT}`);
    logger.info(`[DocuMind Server] Socket.IO escuchando en el mismo puerto (ruta /socket.io)`);
    logger.info(`[DocuMind Server] Documentación Swagger en http://localhost:${PORT}/api/docs`);
  });
}

bootstrap().catch(err => {
  logger.error({ err }, "Fallo durante el arranque del servidor");
  process.exit(1);
});
