import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT || 3005;

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[05 - Persistencia MongoDB/Mongoose] Servidor Express escuchando en http://localhost:${PORT}`);
  });
}

bootstrap();
