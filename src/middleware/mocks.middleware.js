import { config } from "../config/index.js";

export const mocksMiddleware = (req, res, next) => {
  if (config.nodeEnv === "production") {
    return res.status(403).json({
      status: "error",
      message: "El módulo de mocks está deshabilitado en producción"
    });
  }

  next();
};