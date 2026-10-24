import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDB = async (uri?: string): Promise<void> => {
  const mongoURI = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/documind_db";

  try {
    await mongoose.connect(mongoURI);
    logger.info(`[MongoDB] Conectado exitosamente a ${mongoURI}`);
  } catch (error) {
    logger.error({ err: error }, "[MongoDB] Error crítico de conexión");
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("[MongoDB] Conexión cerrada");
};
