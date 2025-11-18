import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // users/:userId
    const userId = req.params.userId;

    const user = await User.findById(userId).select("-__v").lean().exec();

    if (!user) {
      res.status(404).json({
        success: false,
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error("Error getting user by ID:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while getting user by ID",
    });
  }
};

export default getUserById;
