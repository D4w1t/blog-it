import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { logger } from "@/lib/winston";

// Models
import Token from "@/models/token";

import type { Request, Response } from "express";
import { Types } from "mongoose";

import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const existingToken = await Token.exists({ token: refreshToken });

    if (!existingToken) {
      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message: "Invalid refresh token",
      });
      return;
    }

    //verify Refresh Token
    // sample output: { userId: ..., iat: ..., exp: ..., sub: "refreshToken" }
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    // Generate new access token
    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(201).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    logger.error("Error refreshing token:", error);

    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        code: "AuthenticationError",
        message: "Refresh token has expired, please log in again",
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        code: "AuthenticationError",
        message: "Invalid refresh token",
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

export default refreshToken;
