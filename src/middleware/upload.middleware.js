
import { createUpload } from "../config/multer.js";
import { createAppError } from "../utils/errors.js";
import logger from "../utils/logger.js";

const mapUploadError = (error) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return createAppError("FILE_TOO_LARGE");
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return createAppError("INVALID_FILE_FIELD");
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return createAppError("UPLOAD_ERROR");
  }

  if (error.statusCode && error.code) {
    return error;
  }

  return createAppError("UPLOAD_ERROR");
};

export const uploadSingle = (folder, fieldName) => {
  const upload = createUpload(folder).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (error) => {
      if (!error) {
        return next();
      }

      const appError = mapUploadError(error);

      logger.warning("Error durante la carga de un archivo", {
        method: req.method,
        url: req.originalUrl,
        fieldName,
        error: appError.code,
        message: appError.message
      });

      next(appError);
    });
  };
};
