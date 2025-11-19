import { Router } from "express";

import multer from "multer";

import { body } from "express-validator";

// Middlewares
import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

// Controller
import createBlog from "@/controllers/v1/blog/create_blog";

const router = Router();

const upload = multer();

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  upload.single("banner_image"),

  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("content").notEmpty().withMessage("Content is required"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid status value"),

  uploadBlogBanner("post"),
  validationError,
  createBlog
);

export default router;
