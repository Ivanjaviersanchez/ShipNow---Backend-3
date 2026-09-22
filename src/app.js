import express from "express";

import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ShipNow API funcionando correctamente"
  });
});

app.use("/api/products", productRouter);

app.use("/api/users", userRouter);

app.use(errorHandler);

export default app;