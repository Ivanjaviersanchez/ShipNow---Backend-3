import app from "./src/app.js";

import { config } from "./src/config/index.js";
import { connectDatabase } from "./src/config/database.js";

import logger from "./src/utils/logger.js";

const startServer = async () => {
  try {

    await connectDatabase();

    app.listen(config.port, () => {

      logger.info(
        `ShipNow corriendo en puerto ${config.port}`
      );

      logger.info(
        `Entorno: ${config.nodeEnv}`
      );

    });

  } catch (error) {

    logger.error("Error al iniciar ShipNow", {
      message: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

startServer();