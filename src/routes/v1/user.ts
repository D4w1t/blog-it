import { Router } from "express";

import { param, query, body } from "express-validator";

// Middlewares
import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

// Controller
import getCurrentUser from "@/controllers/v1/user/get_current_user";

// Model
import User from "@/models/user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["user", "admin"]),
  getCurrentUser
);

export default router;
