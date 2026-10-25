
import mongoose from "mongoose";
import { before, after } from "mocha";
import { config } from "../src/config/index.js";

import UserModel from "../src/models/user.model.js";
import OrderModel from "../src/models/order.model.js";
import DeliveryModel from "../src/models/delivery.model.js";
import ProductModel from "../src/models/product.model.js";

const TEST_DATABASE_NAME = "shipnow_test";

before(async function () {
  if (config.nodeEnv !== "test") {
    throw new Error(
      "Las pruebas solo pueden ejecutarse con NODE_ENV=test"
    );
  }

  let databaseName;

  try {
    const parsedUri = new URL(config.mongoUri);
    databaseName = parsedUri.pathname.replace(/^\/+/, "").split("?")[0];
  } catch {
    throw new Error("La URI de MongoDB para testing no es válida");
  }

  if (databaseName !== TEST_DATABASE_NAME) {
    throw new Error(
      `Base de datos no permitida para testing: ${databaseName}`
    );
  }

  await mongoose.connect(config.mongoUri);

  if (mongoose.connection.name !== TEST_DATABASE_NAME) {
    await mongoose.disconnect();
    throw new Error("La conexión no apunta a shipnow_test");
  }

  console.log(
    `\nConectado a la base de pruebas: ${mongoose.connection.name}`
  );

  await Promise.all([
    UserModel.deleteMany({}),
    OrderModel.deleteMany({}),
    DeliveryModel.deleteMany({}),
    ProductModel.deleteMany({})
  ]);
});

after(async function () {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log("Conexión de testing cerrada");
  }
});