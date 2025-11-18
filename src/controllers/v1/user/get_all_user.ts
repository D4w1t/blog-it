import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

import config from "@/config";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const { defaultResLimit, defaultResOffset } = config;

  try { 
    const limit = parseInt(req.query.limit as string) || defaultResLimit;
    const offset = parseInt(req.query.offset as string) || defaultResOffset;

    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .select("-__v")
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      limit,
      offset,
      total: totalUsers,
      users,
    });
  } catch (error) {
    logger.error("Error getting all users:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while getting all users",
    });
  }
};

export default getAllUsers;
