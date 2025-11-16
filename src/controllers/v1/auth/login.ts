import bcrypt from "bcrypt";

import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

// Models
import User from "@/models/user";
import Token from "@/models/token";

import config from "@/config";

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type UserData = Pick<IUser, "email" | "password">;

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as UserData;

  const { NODE_ENV } = config;

  try {
    // sample output: { _id: ..., username: ..., email: ..., password: ..., role: ..., ... }
    const user = await User.findOne({ email }).select("+password"); // explicitly include password field

    if (!user) {
      logger.warn("Invalid attempt!");
      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.warn("Invalid attempt!");
      res.status(401).json({
        success: false,
        code: "Unauthorized",
        message: "Invalid email or password",
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in db
    // sample output: { _id: ..., token: ..., user: ... }
    await Token.create({
      token: refreshToken,
      user: user._id,
    });
    logger.info(`Refresh token stored for user: ${user._id}`);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info(`User logged in: ${user._id}`);
  } catch (error) {
    logger.error("Error during user login", error);

    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
    });
  }
};

export default login;
