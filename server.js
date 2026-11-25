import app from "./src/app.js";

import { config } from "./src/config/index.js";
import {
  connectDatabase,
  disconnectDatabase
} from "./src/config/database.js";

import logger from "./src/utils/logger.js";

let server;
let isShuttingDown = false;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(config.port, () => {
      logger.info(
        `ShipNow corriendo en puerto ${config.port}`
      );

      logger.info(
        `Entorno: ${config.nodeEnv}`
      );
    });

    server.on("error", (error) => {
      logger.error("Error en el servidor HTTP", {
        message: error.message,
        stack: error.stack
      });
    });

  } catch (error) {
    logger.error("Error al iniciar ShipNow", {
      message: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    `Señal ${signal} recibida. Iniciando apagado controlado`
  );

  let exitCode = 0;

  // Cierre del servidor HTTP
  try {
    if (server?.listening) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error && error.code !== "ERR_SERVER_NOT_RUNNING") {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      logger.info("Servidor HTTP cerrado correctamente");

    } else {
      logger.info("El servidor HTTP ya estaba detenido");
    }

  } catch (error) {
    exitCode = 1;

    logger.error("Error al cerrar el servidor HTTP", {
      message: error.message,
      stack: error.stack
    });
  }

  // Cierre de MongoDB, independientemente del resultado anterior
  try {
    await disconnectDatabase();

  } catch (error) {
    exitCode = 1;

    logger.error("Error durante el cierre de MongoDB", {
      message: error.message,
      stack: error.stack
    });
  }

  if (exitCode === 0) {
    logger.info("ShipNow se cerró correctamente");
  } else {
    logger.error("ShipNow finalizó con errores durante el apagado");
  }

  process.exit(exitCode);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
