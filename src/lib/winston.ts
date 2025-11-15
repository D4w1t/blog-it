import winston from "winston";

import config from "@/config";

const { NODE_ENV, LOG_LEVEL } = config;

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

if (NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
        errors({ stack: true }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : "";

          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: "logs/app.log",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: NODE_ENV === "test",
});

export { logger };
