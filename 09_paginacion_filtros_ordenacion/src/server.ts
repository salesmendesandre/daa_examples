import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { seedData } from "./data/seed.js";

const PORT = process.env.PORT || 3006;

async function bootstrap() {
  await connectDB();
  await seedData();
  app.listen(PORT, (error?: Error) => {
    // Express 5 llama a este callback TAMBIÉN si el arranque falla (p. ej.
    // EADDRINUSE: otro servidor ya usa el puerto) -> no anunciar un falso "escuchando".
    if (error) throw error;
    console.log(`[Capítulo 9] Servidor Express 5 escuchando en http://localhost:${PORT}`);
    console.log(`[Capítulo 9] Swagger UI disponible en http://localhost:${PORT}/api/docs`);
  });
}

bootstrap();
