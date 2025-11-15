import mongoose from "mongoose";

import type { ConnectOptions } from "mongoose";

import config from "@/config";

import { logger } from "@/lib/winston";

const { DATABASE_URI } = config;

const clientOptions: ConnectOptions = {
  dbName: "blog-db",
  appName: "Blog API",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!DATABASE_URI) {
    throw new Error(
      "DATABASE_URI is not defined. Please set it in the environment variables."
    );
  }

  try {
    await mongoose.connect(DATABASE_URI, clientOptions);

    logger.info("Successfully connected to the database.");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.error("Error connecting to the database:", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info("Successfully disconnected from the database.");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error("Error disconnecting from the database:", error);
  }
};
