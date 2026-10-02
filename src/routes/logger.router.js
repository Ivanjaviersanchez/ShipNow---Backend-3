import { Router } from "express";

import { loggerController } from "../controllers/logger.controller.js";

const router = Router();

router.get(
  "/loggerTest",
  loggerController.testLogger.bind(loggerController)
);

export default router;