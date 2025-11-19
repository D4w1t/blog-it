import { logger } from "@/lib/winston";

// Models
import Blog from "@/models/blog";
import User from "@/models/user";

import type { Request, Response } from "express";

import config from "@/config";

interface QueryType {
  status?: "draft" | "published";
}

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { defaultResLimit, defaultResOffset } = config;

  try {
    const limit = parseInt(req.query.limit as string) || defaultResLimit;
    const offset = parseInt(req.query.offset as string) || defaultResOffset;

    
    const user = await User.findById(userId).select("role").lean().exec();

    const query: QueryType = {};
    
    // Return published blogs for regular users
    if (user?.role === "user") {
        query.status = "published";
    }
    
    const totalBlogs = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select("-banner.publicId -__v")
      .populate("author", "-__v -createdAt -updatedAt") // Populate author details
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      limit,
      offset,
      total: totalBlogs,
      blogs,
    });
  } catch (error) {
    logger.error("Error getting all blogs:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while getting all blogs",
    });
  }
};

export default getAllBlogs;
