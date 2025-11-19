import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import Blog from "@/models/blog";

import { logger } from "@/lib/winston";

import type { Request, Response } from "express";
import type { IBlog } from "@/models/blog";

type blogData = Pick<IBlog, "title" | "content" | "banner" | "status">;

// Sanitize Blog content
const window = new JSDOM("").window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as blogData;

    const userId = req.userId;

    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    logger.info(`Blog created with ID: ${newBlog._id}`);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    logger.error("Error creating blog:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while creating blog",
    });
  }
};

export default createBlog;
