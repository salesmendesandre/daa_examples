import "dotenv/config";
import { connectDB, disconnectDB } from "../config/database.js";
import { seedDemoData } from "./seed.js";

// `npm run seed`: vacía las colecciones y vuelve a cargar los datos de demostración.
await connectDB();
await seedDemoData({ reset: true });
await disconnectDB();
