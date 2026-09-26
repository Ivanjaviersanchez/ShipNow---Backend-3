import { Router } from "express";

import { ordersController } from "../controllers/orders.controller.js";

const router = Router();

router.get(
  "/",
  ordersController.getAll.bind(ordersController)
);

router.get(
  "/:id",
  ordersController.getById.bind(ordersController)
);

router.post(
  "/",
  ordersController.create.bind(ordersController)
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