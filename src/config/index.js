import dotenv from "dotenv";

const isTest = process.env.NODE_ENV === "test";

dotenv.config({
  path: isTest ? ".env.test" : ".env"
});

const requiredEnvVariables = [
  "PORT",
  "NODE_ENV",
  isTest ? "MONGODB_URI_TEST" : "MONGODB_URI"
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Falta configurar la variable de entorno: ${variable}`
    );
  }
}

const mongoUri = isTest
  ? process.env.MONGODB_URI_TEST
  : process.env.MONGODB_URI;

// Protección adicional: impedir que los tests usen la base de desarrollo.
if (isTest) {
  let databaseName;

  try {
    const parsedUri = new URL(mongoUri);
    databaseName = parsedUri.pathname.replace(/^\/+/, "");
  } catch {
    throw new Error("MONGODB_URI_TEST no es una URI válida");
  }

  databaseName = databaseName.split("?")[0];

  if (databaseName !== "shipnow_test") {
    throw new Error(
      "Configuración de testing inválida: MONGODB_URI_TEST debe apuntar a shipnow_test"
    );
  }
}

export const config = {
  port: Number(process.env.PORT),
  mongoUri,
  nodeEnv: process.env.NODE_ENV
};