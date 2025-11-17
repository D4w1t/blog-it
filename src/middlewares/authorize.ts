import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response, NextFunction } from "express";

export type AuthRole = "user" | "admin";

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select("role").exec();

      if (!user) {
        logger.warn(`Authorization failed: User not found (ID: ${userId})`);

        res.status(404).json({
          success: false,
          code: "NotFound",
          message: "User not found",
        });
        return;
      }

      if (!roles.includes(user.role)) {
        logger.warn(
          `Authorization failed: Insufficient permissions for user ID ${userId} with role ${user.role}`
        );

        res.status(403).json({
          success: false,
          code: "Forbidden",
          message: "You do not have permission to access this resource",
        });
        return;
      }

      return next();
    } catch (error) {
        logger.error(`Authorization error for user ID ${userId}: `, error);

        res.status(500).json({
          success: false,
          code: "ServerError",
          message: "Internal server error during authorization",
        });
        return;
    }
  };
};

export default authorize;
