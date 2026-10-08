import express from "express";
import swaggerUi from "swagger-ui-express";

import router from "./routes/index.js";

import { swaggerSpecs } from "./docs/swagger.config.js";

import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ShipNow API funcionando correctamente",
  });
});

// Documentacion Swagger / OpenAPI
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs)
);

// Rutas principales de la API
app.use("/api", router);

// Manejo de rutas inexistentes
app.use(notFoundHandler);

// Manejo global de errores
app.use(errorHandler);

export default app;