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

const consoleLevel =
  config.nodeEnv === "production"
    ? "info"
    : "debug";

const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),

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

const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),

  winston.format.json()
);

const errorRotateTransport =
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",

    datePattern: "YYYY-MM-DD",

    level: "error",

    maxFiles: "14d",

    format: fileFormat
  });

const logger = winston.createLogger({

  levels: customLevels.levels,

  level: "debug",

  format: fileFormat,

  transports: [

    new winston.transports.Console({
      level: consoleLevel,
      format: consoleFormat
    }),

    errorRotateTransport

  ]
});

export default logger;