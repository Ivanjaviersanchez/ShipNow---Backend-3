import { Router } from "express";

import {
  deliveriesController
} from "../controllers/deliveries.controller.js";

const router = Router();

router.get(
  "/",
  deliveriesController.getAll.bind(
    deliveriesController
  )
);

router.get(
  "/:id",
  deliveriesController.getById.bind(
    deliveriesController
  )
);

router.post(
  "/",
  deliveriesController.create.bind(
    deliveriesController
  )
);

router.patch(
  "/:id/status",
  deliveriesController.updateStatus.bind(
    deliveriesController
  )
);

router.delete(
  "/:id",
  deliveriesController.delete.bind(
    deliveriesController
  )
);

export default router;