import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import type { CorsOptions } from "cors";

import config from "@/config";

import limiter from "@/lib/express_rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";

import router from "@/routes/v1";

import { logger } from "@/lib/winston";

const app = express();

const { PORT, NODE_ENV } = config;

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (NODE_ENV === "development" || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed in cors`),
        false
      );
      logger.warn(`CORS error: ${origin} is not allowed in cors`);
    }
  },
};

// CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, //
  })
);
app.use(helmet());

// Rate limiting Middleware
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use("/api/v1", router);

    app.listen(PORT, () => {
      logger.info(`Blog API running on: http://localhost:${PORT}`);
    });

    if (NODE_ENV === "production") {
      process.exit(1);
    }
  } catch (error) {
    logger.error("Failed to start the server", error);
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();

    logger.warn("Server is shutting down...");
    process.exit(0);
  } catch (error) {
    logger.error("Error during server shutdown", error);
  }
};

process.on("SIGINT", handleServerShutdown);
process.on("SIGTERM", handleServerShutdown);
