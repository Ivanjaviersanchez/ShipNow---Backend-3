
import express from "express";
import path from "node:path";

import swaggerUi from "swagger-ui-express";

import router from "./routes/index.js";
import { swaggerSpecs } from "./docs/swagger.config.js";
import { config } from "./config/index.js";

import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Middlewares globales
app.use(express.json());

// Archivos estáticos
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
);

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ShipNow API funcionando correctamente"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: config.nodeEnv,
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  });
});

// Documentación Swagger
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs)
);

// Rutas de la API
app.use("/api", router);

// Manejo de rutas inexistentes
app.use(notFoundHandler);

// Manejo centralizado de errores
app.use(errorHandler);

export default app;
