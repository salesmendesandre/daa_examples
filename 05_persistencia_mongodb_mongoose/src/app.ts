import express from "express";
import { connectDB } from "./config/database.js";
import documentsRoutes from "./routes/documents.routes.js";

export const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use("/api/documents", documentsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "MongoDB Mongoose API" });
});

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[MongoDB API] Servidor escuchando en http://localhost:${PORT}`);
    });
  });
}
