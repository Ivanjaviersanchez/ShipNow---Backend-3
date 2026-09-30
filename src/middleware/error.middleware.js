import { config } from "../config/index.js";

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error("❌ Error:", error);

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