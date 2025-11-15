import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
  };
}

// User Schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxLength: [20, "Username cannot exceed 20 characters"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [50, "Email cannot exceed 50 characters"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    firstName: {
      type: String,
      maxLength: [20, "First name cannot exceed 20 characters"],
    },
    lastName: {
      type: String,
      maxLength: [20, "Last name cannot exceed 20 characters"],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, "Website URL cannot exceed 100 characters"],
      },
      facebook: {
        type: String,
        maxLength: [100, "Facebook URL cannot exceed 100 characters"],
      },
      linkedin: {
        type: String,
        maxLength: [100, "LinkedIn URL cannot exceed 100 characters"],
      },
      instagram: {
        type: String,
        maxLength: [100, "Instagram URL cannot exceed 100 characters"],
      },
      x: {
        type: String,
        maxLength: [100, "X URL cannot exceed 100 characters"],
      },
      youtube: {
        type: String,
        maxLength: [100, "YouTube URL cannot exceed 100 characters"],
      },
    },
  },
  {
    timestamps: true,
  }
);

// pre-save hook: hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  // Hash the password with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>("User", userSchema);
