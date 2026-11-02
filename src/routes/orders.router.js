
import { Router } from "express";

import { ordersController } from "../controllers/orders.controller.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = Router();

router.get(
  "/",
  ordersController.getAll.bind(ordersController)
);

router.post(
  "/",
  ordersController.create.bind(ordersController)
);

// Carga de comprobante: campo multipart "proof"
router.post(
  "/:id/proof",
  uploadSingle("proofs", "proof"),
  ordersController.uploadProof.bind(ordersController)
);

router.get(
  "/:id",
  ordersController.getById.bind(ordersController)
);

router.patch(
  "/:id/status",
  ordersController.updateStatus.bind(ordersController)
);

router.delete(
  "/:id",
  ordersController.delete.bind(ordersController)
);

export default router;
