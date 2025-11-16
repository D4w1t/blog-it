// Models
import User from "@/models/user";
import Token from "@/models/token";

import { genUsername } from "@/utils";

import config from "@/config";

import { logger } from "@/lib/winston";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type UserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  const { NODE_ENV, WHITELIST_ADMINS_MAIL } = config;

  if (role === "admin" && !WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: "Forbidden",
      message: "You are not allowed to register as admin",
    });
    logger.warn(
      `Registration attempt with admin role using unwhitelisted email: ${email}`
    );
    return;
  }

  try {
    const username = genUsername();

    // sample output: { _id: ..., username: ..., email: ..., role: ..., ... }
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db
    // sample output: { _id: ..., token: ..., user: ... }
    await Token.create({
      token: refreshToken,
      user: newUser._id,
    });
    logger.info(`Refresh token stored for user: ${newUser._id}`);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info(
      `New user: ${newUser.username} registered with email: ${newUser.email} and role: ${newUser.role}`
    );
  } catch (error) {
    logger.error("Error during user registration", error);

    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
    });
  }
};

export default register;
