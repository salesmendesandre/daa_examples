import mongoose from "mongoose";

export const connectDB = async (uri?: string): Promise<void> => {
  const mongoURI = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/documind_db";

  try {
    await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Conexión establecida con éxito: ${mongoURI}`);
  } catch (error) {
    console.error("[MongoDB] Error crítico de conexión:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", err => {
    console.error("[MongoDB] Error en conexión activa:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Conexión desconectada");
  });
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("[MongoDB] Conexión cerrada");
};
