import { Router } from "express";

import { body } from "express-validator";

import register from "@/controllers/v1/auth/register";

import User from "@/models/user";

// Middlewares
import validationError from "@/middlewares/validationError";

const router = Router();

router.post(
  "/register",

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .normalizeEmail() // lowercase and remove dots for gmail
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters")
    .custom(async (value) => {
      const existingUser = await User.exists({ email: value });

      if (existingUser) {
        throw new Error("Email is already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
    ),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["user", "admin"])
    .withMessage("Invalid role, must be 'user' or 'admin'"),

  validationError, // middleware to handle validation errors

  register
);

export default router;
