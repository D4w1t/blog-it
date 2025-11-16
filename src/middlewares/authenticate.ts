import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyAccessToken } from "@/lib/jwt";

import { logger } from "@/lib/winston";

import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      code: "Unauthorized",
      message: "Access denied, No token provided",
    });
    return;
  }

  const [_, token] = authHeader.split(" ");

  try {
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach userId to request object for downstream use
    req.userId = jwtPayload.userId;

    return next();
  } catch (error) {
    logger.warn("Authentication failed", error);

    // Expired token
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message:
          "Access token has expired, request a new one with refresh token",
      });
      return;
    }

    // Invalid token
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message: "Invalid access token",
      });
      return;
    }

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error",
    });
  }
};

export default authenticate;
