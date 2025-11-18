import dotenv from "dotenv";

import type ms from "ms";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URI: process.env.DATABASE_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET! || "default_access_secret",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET! || "default_refresh_secret",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: (() => {
    try {
      return JSON.parse(process.env.WHITELIST_ADMINS_MAIL || "[]") as string[];
    } catch (error) {
      console.error(
        "Failed to parse WHITELIST_ADMINS_MAIL env variable, falling back to empty array.",
        error
      );
      return [];
    }
  })(),
  defaultResLimit: 20,
  defaultResOffset: 0,
};

export default config;
