import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[01_fundamentos_express_ts] Servidor Express 5 escuchando en http://localhost:${PORT}`);
});
