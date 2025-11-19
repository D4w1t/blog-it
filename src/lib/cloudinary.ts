import { v2 as cloudinary } from "cloudinary";

import config from "@/config";

import { logger } from "@/lib/winston";

import type { UploadApiResponse } from "cloudinary";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  NODE_ENV,
} = config;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: NODE_ENV === "production",
});

const uploadToCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ["jpg", "png", "jpeg", "webp"],
          resource_type: "image",
          folder: "blog_api",
          public_id: publicId,
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload error:", error);
            reject(error);
          }

          resolve(result);
        }
      )
      .end(buffer);
  });
};

export default uploadToCloudinary;
