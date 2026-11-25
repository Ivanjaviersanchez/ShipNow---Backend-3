
import { createAppError } from "./errors.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const parsePagination = (query = {}) => {
  const page = query.page === undefined
    ? DEFAULT_PAGE
    : Number(query.page);

  const requestedLimit = query.limit === undefined
    ? DEFAULT_LIMIT
    : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    throw createAppError(
      "VALIDATION_ERROR",
      "El parámetro page debe ser un número entero mayor a 0"
    );
  }

  if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
    throw createAppError(
      "VALIDATION_ERROR",
      "El parámetro limit debe ser un número entero mayor a 0"
    );
  }

  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages
  };
};
