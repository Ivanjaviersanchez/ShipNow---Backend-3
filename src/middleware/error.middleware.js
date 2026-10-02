import { config } from "../config/index.js";
import logger from "../utils/logger.js";

export const errorHandler = (
  error,
  req,
  res,
  next
) => {

  logger.error("Error en la API", {
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode || 500
  });

  const statusCode =
    error.statusCode || 500;

  const errorCode =
    error.code || "INTERNAL_SERVER_ERROR";

  const message =
    error.message ||
    "Ocurrió un error interno del servidor";

  const response = {
    status: "error",
    error: errorCode,
    message
  };

  if (config.nodeEnv === "development") {
    response.details = {
      name: error.name,
      stack: error.stack
    };
  }

  res.status(statusCode).json(response);
};