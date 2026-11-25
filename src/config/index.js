import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";
const isTest = nodeEnv === "test";

dotenv.config({
  path: isTest ? ".env.test" : ".env"
});

const allowedEnvironments = [
  "development",
  "test",
  "production"
];

if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error(
    `NODE_ENV inválido: ${nodeEnv}. Valores permitidos: ${allowedEnvironments.join(", ")}`
  );
}

const requiredEnvVariables = [
  "PORT",
  isTest ? "MONGODB_URI_TEST" : "MONGODB_URI"
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Falta configurar la variable de entorno: ${variable}`
    );
  }
}

// Validación del puerto
const port = Number(process.env.PORT);

if (
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  throw new Error(
    "PORT debe ser un número entero entre 1 y 65535"
  );
}

const mongoUri = isTest
  ? process.env.MONGODB_URI_TEST
  : process.env.MONGODB_URI;

// Protección adicional: impedir que los tests
// utilicen accidentalmente la base de desarrollo.
if (isTest) {
  let databaseName;

  try {
    const parsedUri = new URL(mongoUri);

    if (!["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol)) {
      throw new Error("Protocolo MongoDB inválido");
    }

    databaseName = parsedUri.pathname.replace(/^\/+/, "");
  } catch {
    throw new Error(
      "MONGODB_URI_TEST no es una URI válida"
    );
  }

  databaseName = databaseName.split("?")[0];

  if (databaseName !== "shipnow_test") {
    throw new Error(
      "Configuración de testing inválida: MONGODB_URI_TEST debe apuntar a shipnow_test"
    );
  }
}

// Nivel de logging predeterminado según el entorno
const defaultLogLevels = {
  development: "debug",
  test: "error",
  production: "info"
};

const logLevel =
  process.env.LOG_LEVEL || defaultLogLevels[nodeEnv];

const allowedLogLevels = [
  "fatal",
  "error",
  "warning",
  "info",
  "http",
  "debug"
];

if (!allowedLogLevels.includes(logLevel)) {
  throw new Error(
    `LOG_LEVEL inválido: ${logLevel}. Valores permitidos: ${allowedLogLevels.join(", ")}`
  );
}

export const config = {
  port,
  mongoUri,
  nodeEnv,
  logLevel
};
