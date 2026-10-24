// Orígenes permitidos para el frontend (por defecto, el servidor de desarrollo de Vite).
// Los comparten Express (cors) y Socket.IO, para que ambos acepten exactamente los mismos.
export const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);
