import { v4 as uuidv4 } from "uuid";

// Generate random username
export const genUsername = (): string => {
  const userNamePrefix = "user-";
  const randomChars = Math.random().toString(36).slice(2); // example: '0.5xtj3z9' -> '5xtj3z9'

  const uniqueId = uuidv4();

  const username = userNamePrefix + randomChars + "-" + uniqueId;

  return username;
};

// Generate random slug from title
export const generateSlug = (title: string): string => {
  const slugBase = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen

  const uniqueId = uuidv4().split("-")[0]; // Use first segment of UUID

  return `${slugBase}-${uniqueId}`;
};
