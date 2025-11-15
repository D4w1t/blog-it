import { validationResult } from "express-validator";

import type { Request, Response, NextFunction } from "express";

import { logger } from "@/lib/winston";

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      code: "ValidationError",
      errors: errors.mapped(), // Return errors as an object with field names as keys
    });

    // Log the validation error messages
    logger.error(
      `Validation error: ${errors.array().map(err => err.msg).join(", ")}`
    );
    return;
  }

  next();
};

export default validationError;
