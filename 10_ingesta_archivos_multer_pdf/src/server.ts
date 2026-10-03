import { app } from "./app.js";
import { warmupPdfParser } from "./services/pdf.service.js";

const PORT = process.env.PORT || 3010;

async function bootstrap() {
  await warmupPdfParser();
  app.listen(PORT, (error?: Error) => {
    // Express 5 llama a este callback TAMBIÉN si el arranque falla (p. ej.
    // EADDRINUSE: otro servidor ya usa el puerto) -> no anunciar un falso "escuchando".
    if (error) throw error;
    console.log(`Servidor Express 5 escuchando en http://localhost:${PORT}`);
    console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
  });
}

bootstrap();
