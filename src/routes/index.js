import { Router } from "express";

import productRouter from "./product.router.js";
import userRouter from "./user.router.js";
import ordersRouter from "./orders.router.js";
import deliveriesRouter from "./deliveries.router.js";
import mocksRouter from "./mocks.router.js";

const router = Router();

router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/orders", ordersRouter);
router.use("/deliveries", deliveriesRouter);
router.use("/mocks", mocksRouter);

export default router;