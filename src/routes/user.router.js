
import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadUserDocument
} from "../controllers/user.controller.js";

import { uploadSingle } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getAllUsers);

router.post("/", createUser);

// Carga de documentos: campo multipart "document"
router.post(
  "/:id/documents",
  uploadSingle("documents", "document"),
  uploadUserDocument
);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
