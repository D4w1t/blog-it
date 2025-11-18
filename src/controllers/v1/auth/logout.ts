import { logger } from "@/lib/winston";

// Models
import Token from "@/models/token";

import type { Request, Response } from "express";

import config from "@/config";

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { NODE_ENV } = config;

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      logger.warn("Logout attempted without refresh token", {
        userId: req.userId,
      });

      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message: "You are already logged out",
      });
      return;
    }

    const token = await Token.findOneAndDelete({ token: refreshToken });

    if (!token) {
      logger.warn("Invalid refresh token on logout", {
        userId: req.userId,
      });

      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message: "Session already expired or invalid",
      });
      return;
    }

    logger.info("User logged out successfully and refresh token deleted", {
      userId: req.userId,
      token:
        typeof refreshToken === "string"
          ? `***${refreshToken.slice(-4)}`
          : undefined,
    });

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.sendStatus(204); // No Content
  } catch (error) {
    logger.error("Error during user logout", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error",
    });
  }
};

export default logout;
