import { app } from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Semana 2 - Sesión 2] Servidor Express 5 escuchando en http://localhost:${PORT}`);
});
