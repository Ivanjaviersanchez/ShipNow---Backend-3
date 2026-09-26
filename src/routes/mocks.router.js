import { Router } from "express";

import { mocksController } from "../controllers/mocks.controller.js";
import { mocksMiddleware } from "../middleware/mocks.middleware.js";

const router = Router();

router.use(mocksMiddleware);

router.post(
  "/seed",
  mocksController.seedAll.bind(mocksController)
);

router.get(
  "/users",
  mocksController.generateUsers.bind(mocksController)
);

router.post(
  "/users",
  mocksController.seedUsers.bind(mocksController)
);

router.post(
  "/orders",
  mocksController.generateOrders.bind(mocksController)
);

router.post(
  "/orders/seed",
  mocksController.seedOrders.bind(mocksController)
);

router.post(
  "/deliveries",
  mocksController.generateDeliveries.bind(
    mocksController
  )
);

router.post(
  "/deliveries/seed",
  mocksController.seedDeliveries.bind(
    mocksController
  )
);

export default router;