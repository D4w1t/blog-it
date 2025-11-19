import Blog from "@/models/blog";

import { logger } from "@/lib/winston";

// Lib
import uploadToCloudinary from "@/lib/cloudinary";

import type { Request, Response, NextFunction } from "express";
import type { UploadApiErrorResponse } from "cloudinary";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadBlogBanner = (method: "post" | "put") => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Method is PUT and no file is provided, skip the upload process.
    if (method === "put" && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        code: "NoFile",
        message: "No banner image file provided",
      });
      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        success: false,
        code: "FileTooLarge",
        message: "Banner image exceeds the maximum allowed size of 5MB",
      });
      return;
    }

    try {
      //   const { blogId } = req.params; // /blogs/:blogId/banner

      //   const blog = await Blog.findById(blogId).select("banner.publicId").exec();

      const data = await uploadToCloudinary(
        req.file.buffer
        // blog?.banner.publicId.replace("blog_api/", "")
      );

      if (!data) {
        logger.error("Cloudinary upload failed: No data returned", {
          // blogId,
          // publicId: blog?.banner.publicId,
        });

        res.status(500).json({
          success: false,
          code: "UploadFailed",
          message: "Failed to upload banner image",
        });
        return;
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info("Banner image uploaded to Cloudinary", {
        // blogId,
        banner: newBanner,
      });

      // Attach banner info to request body for the next middleware/controller
      req.body.banner = newBanner;
      next();
    } catch (error: UploadApiErrorResponse | any) {
      logger.error("Error uploading banner image to Cloudinary:", error);

      res.status(error.http_code || 500).json({
        success: false,
        code: error.name || "UploadFailed",
        message: error.message || "Failed to upload banner image",
      });
    }
  };
};

export default uploadBlogBanner;
