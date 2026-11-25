
import { config } from "../config/index.js";
import logger from "../utils/logger.js";

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  const statusCode = error.statusCode || 500;

  const isProduction = config.nodeEnv === "production";
  const isInternalError = statusCode >= 500;

  // Registramos los detalles completos en el servidor.
  // No los enviamos al cliente en producción.
  logger.error("Error en la API", {
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    stack: error.stack,
    code: error.code,
    statusCode
  });

  const errorCode = isProduction && isInternalError
    ? "INTERNAL_SERVER_ERROR"
    : error.code || "INTERNAL_SERVER_ERROR";

  const message = isProduction && isInternalError
    ? "Ocurrió un error interno del servidor"
    : error.message || "Ocurrió un error interno del servidor";

  const response = {
    status: "error",
    error: errorCode,
    message
  };

  // Los detalles técnicos solo se exponen en desarrollo.
  if (config.nodeEnv === "development") {
    response.details = {
      name: error.name,
      stack: error.stack
    };
  }

  res.status(statusCode).json(response);
};
