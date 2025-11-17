import { Router } from "express";

import { param, query, body } from "express-validator";

// Middlewares
import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

// Controller
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";

// Model
import User from "@/models/user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["user", "admin"]),
  getCurrentUser
);

router.put(
  "/current",
  authenticate,
  authorize(["user", "admin"]),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .custom(async (value, { req }) => {
      const existingUsername = await User.findOne({ username: value });

      if (existingUsername && existingUsername._id.toString() !== req.userId) {
        throw new Error("Username is already in use");
      }
    }),
  body("email")
    .optional()
    .trim()
    .normalizeEmail() // lowercase and remove dots for gmail
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters")
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });

      if (existingUser && existingUser._id.toString() !== req.userId) {
        throw new Error("Email is already in use");
      }
    }),
  body("password")
    .optional()
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
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("First name must be at most 20 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Last name must be at most 20 characters"),
  body(["website", "facebook", "linkedin", "instagram", "x", "youtube"])
    .optional()
    .isURL()
    .withMessage("Invalid URL format")
    .isLength({ max: 100 })
    .withMessage("URL must be at most 100 characters"),

  validationError,
  updateCurrentUser
);

router.delete(
  "/current",
  authenticate,
  authorize(["user", "admin"]),
  deleteCurrentUser
);

export default router;
