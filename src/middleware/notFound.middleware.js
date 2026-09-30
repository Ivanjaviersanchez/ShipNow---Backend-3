import { createAppError } from "../utils/errors.js";

export const notFoundHandler = (req, res, next) => {
  next(createAppError("ROUTE_NOT_FOUND"));
};