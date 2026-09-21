import mongoose from "mongoose";
import { config } from "./index.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:");
    console.error(error.message);

    process.exit(1);
  }
};