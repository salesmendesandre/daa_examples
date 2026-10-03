import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/documind";

  try {
    await mongoose.connect(mongoUri);
    console.log("[MongoDB] Conectado con éxito");
  } catch (error) {
    console.error("[MongoDB] Error al conectar:", error);
    process.exit(1);
  }
};
