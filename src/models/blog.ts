import { Schema, model, Types } from "mongoose";

import { generateSlug } from "@/utils";

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    publicId: string;
    url: string;
    height: number;
    width: number;
  };
  author: Types.ObjectId;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  status: "draft" | "published";
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Blog Content is required"],
    },
    banner: {
      publicId: { type: String, required: [true, "Public ID is required"] },
      url: { type: String, required: [true, "URL is required"] },
      height: { type: Number, required: [true, "Height is required"] },
      width: { type: Number, required: [true, "Width is required"] },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "{VALUE} is not supported",
      },
      default: "draft",
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
      updatedAt: "updatedAt",
    },
  }
);

blogSchema.pre("validate", function (next) {
  // Generate slug from title if not provided
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);
  }

  next();
});

export default model<IBlog>("Blog", blogSchema);
