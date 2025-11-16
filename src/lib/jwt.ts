import jwt from "jsonwebtoken";

import config from "@/config";

import { Types } from "mongoose";

const {
  JWT_ACCESS_SECRET,
  ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRY,
} = config;

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    subject: "accessAPI",
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    subject: "refreshToken",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
