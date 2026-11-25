import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { config } from "../config/index.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  }
};

// Colores personalizados para los niveles del logger
winston.addColors({
  fatal: "bold red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "cyan",
  debug: "blue"
});

// Formato para consola
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  winston.format.colorize(),
  winston.format.printf(
    ({ timestamp, level, message, ...metadata }) => {
      const metadataString =
        Object.keys(metadata).length > 0
          ? ` ${JSON.stringify(metadata)}`
          : "";

      return `${timestamp} [${level}] ${message}${metadataString}`;
    }
  )
);

// Formato JSON para archivos
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  winston.format.json()
);

const transports = [];

// Testing: transporte silencioso, sin salida de logs
if (config.nodeEnv === "test") {
  transports.push(
    new winston.transports.Console({
      silent: true
    })
  );
}

// Desarrollo: logs en consola
if (config.nodeEnv === "development") {
  transports.push(
    new winston.transports.Console({
      level: config.logLevel,
      format: consoleFormat
    })
  );
}

// Producción: errores en archivos rotativos
if (config.nodeEnv === "production") {
  transports.push(
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d",
      format: fileFormat
    })
  );
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: config.logLevel,
  format: fileFormat,
  transports
});

export default logger;
