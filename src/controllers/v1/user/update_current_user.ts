import { logger } from "@/lib/winston";

import bcrypt from "bcrypt";

import User from "@/models/user";

import type { Request, Response } from "express";

const updateCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  const {
    username,
    email,
    password,
    currentPassword,
    firstName,
    lastName,
    website,
    facebook,
    linkedin,
    instagram,
    x,
    youtube,
  } = req.body;

  try {
    const user = await User.findById(userId).select("+password -__v").exec();

    if (!user) {
      res.status(404).json({
        success: false,
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    // Update password if provided
    if (password) {
      // Require current password in the request body
      if (!req.body.currentPassword) {
        res.status(400).json({
          success: false,
          code: "BadRequest",
          message: "Current password is required to update password",
        });
        return;
      }

      if (!user.password) {
        res.status(500).json({
          success: false,
          code: "ServerError",
          message: "Stored password is missing for the user",
        });
        return;
      }
      
      // Compare current password with stored password using bcrypt
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          code: "Unauthorized",
          message: "Current password is incorrect",
        });
        return;
      }
      user.password = password;
    }

    // Update fields if they are provided in the request body
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save(); // This will trigger pre-save hooks, including password hashing

    logger.info(`User updated successfully (ID: ${userId})`);

    const updatedUser = await User.findById(userId)
      .select("-__v -password")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Error updating current user:", error);

    res.status(500).json({
      success: false,
      code: "ServerError",
      message: "Internal server error while updating current user",
    });
  }
};

export default updateCurrentUser;
