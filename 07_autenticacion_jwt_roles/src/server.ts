import { app } from "./app.js";
import { seedHospitalData } from "./data/seed.js";

const PORT = process.env.PORT || 3008;

async function bootstrap() {
  // Datos de demostración del dominio Hospital (EJERCICIOS): usuarios e
  // historiales clínicos con IDs fijos, para que los curl del README funcionen.
  await seedHospitalData();

  app.listen(PORT, (error?: Error) => {
    // Express 5 llama a este callback TAMBIÉN si el arranque falla (p. ej.
    // EADDRINUSE: otro servidor ya usa el puerto) -> no anunciar un falso "escuchando".
    if (error) throw error;
    console.log(`Servidor Express 5 escuchando en http://localhost:${PORT}`);
    console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
  });
}

bootstrap();
