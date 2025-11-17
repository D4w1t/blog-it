import { logger } from "@/lib/winston";

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

    // Update fields if they are provided in the request body
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
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
