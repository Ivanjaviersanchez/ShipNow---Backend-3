import { config } from "../config/index.js";
import { createAppError } from "../utils/errors.js";

export const mocksMiddleware = (req, res, next) => {

  if (config.nodeEnv === "production") {
    return next(createAppError("FORBIDDEN"));
  }

  next();
};