import mongoose from "mongoose";

import type { ConnectOptions } from "mongoose";

import config from "@/config";

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

    console.log("Successfully connected to the database.");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    console.log("Error connecting to the database:", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    console.log("Successfully disconnected from the database.");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    console.log("Error disconnecting from the database:", error);
  }
};
