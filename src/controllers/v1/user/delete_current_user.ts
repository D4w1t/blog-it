import { logger } from "@/lib/winston";

import User from "@/models/user";
import Token from "@/models/token";

import type { Request, Response } from "express";

import config from "@/config";

const deleteCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  const { NODE_ENV } = config;

  try {
    await User.deleteOne({ _id: userId });

    logger.info(`User deleted successfully (ID: ${userId})`);

    // Delete all tokens associated with the user (e.g., refresh tokens)
    await Token.deleteMany({ user: userId });
    logger.info(`Tokens deleted for user (ID: ${userId})`);

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.sendStatus(204);
  } catch (error) {
    logger.error("Error deleting current user:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while deleting current user",
    });
  }
};

export default deleteCurrentUser;
