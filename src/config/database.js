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

    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info("Conexión con MongoDB cerrada correctamente");
    }
  } catch (error) {
    logger.error("Error al cerrar la conexión con MongoDB", {
      message: error.message,
      stack: error.stack
    });

    throw error;
  }
};
