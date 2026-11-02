
import multer from "multer";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import { createAppError } from "../utils/errors.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Map([
  ["application/pdf", ".pdf"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);

const createStorage = (folder) =>
  multer.diskStorage({
    destination: async (req, file, callback) => {
      try {
        const destinationPath = path.resolve(
          process.cwd(),
          "uploads",
          folder
        );

        await mkdir(destinationPath, { recursive: true });

        callback(null, destinationPath);
      } catch (error) {
        callback(error);
      }
    },

    filename: (req, file, callback) => {
      const extension = ALLOWED_MIME_TYPES.get(file.mimetype);

      callback(null, `${randomUUID()}${extension}`);
    }
  });

const fileFilter = (req, file, callback) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return callback(createAppError("INVALID_FILE_TYPE"));
  }

  callback(null, true);
};

export const createUpload = (folder) =>
  multer({
    storage: createStorage(folder),
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1
    }
  });
