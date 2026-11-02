
import { unlink } from "node:fs/promises";

export const removeUploadedFile = async (filePath) => {
  if (!filePath) return;

  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};
