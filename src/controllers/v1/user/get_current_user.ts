import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-__v -password").lean().exec(); // Exclude __v and password fields

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
    logger.error("Error fetching current user:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while fetching current user",
    });
  }
};

export default getCurrentUser;
