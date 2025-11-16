import { logger } from "@/lib/winston";

// Models
import Token from "@/models/token";

import type { Request, Response } from "express";

import config from "@/config";

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { NODE_ENV } = config;

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });

      logger.info("User refresh token deleted on logout", {
        userId: req.userId,
        token: refreshToken,
      });

      // Clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    res.sendStatus(204); // No Content

    logger.info("User logged out successfully", { userId: req.userId });
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
