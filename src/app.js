import express from "express";

import router from "./routes/index.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ShipNow API funcionando correctamente"
  });
});

app.use("/api", router);

app.use(errorHandler);

export default app;