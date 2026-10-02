import mongoose from "mongoose";

import { config } from "./index.js";
import logger from "../utils/logger.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    logger.info("MongoDB conectado correctamente");

  } catch (error) {

    logger.error("Error al conectar con MongoDB", {
      message: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};