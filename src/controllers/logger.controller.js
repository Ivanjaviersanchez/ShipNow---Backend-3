import logger from "../utils/logger.js";

class LoggerController {

  testLogger(req, res) {

    logger.debug("Logger test - nivel debug");

    logger.http("Logger test - nivel http");

    logger.info("Logger test - nivel info");

    logger.warning("Logger test - nivel warning");

    logger.error("Logger test - nivel error");

    logger.fatal("Logger test - nivel fatal");

    res.status(200).json({
      status: "success",
      message: "Logger test ejecutado correctamente",
      levels: [
        "debug",
        "http",
        "info",
        "warning",
        "error",
        "fatal"
      ]
    });
  }
}

export const loggerController =
  new LoggerController();