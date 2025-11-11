import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60000, // 1-minute time window for request limiting
  limit: 60, // Allow a max of 60 requests per window per IP
  standardHeaders: "draft-6", // use the latest standard rate-limit headers
  legacyHeaders: false, // Disable deprecated X-RateLimit Headers
  message: {
    error: "You have sent too many requests. Please try again",
  },
});

export default limiter;
