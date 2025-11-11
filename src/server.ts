import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import type { CorsOptions } from "cors";

import config from "@/config";
import limiter from "@/lib/express_rate_limit";

const app = express();

const { PORT, NODE_ENV } = config;

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (NODE_ENV === "development" || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed in cors`),
        false
      );
    }
  },
};

// CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, //
  })
);
app.use(helmet());

// Rate limiting Middleware
app.use(limiter);

(async () => {
  try {
    app.get("/", (req, res) => {
      res.json({
        message: "Welcome to the blog API",
      });
    });

    app.listen(PORT, () => {
      console.log(`Blog API running on: http://localhost:${PORT}`);
    });

    if (NODE_ENV === "production") {
      process.exit(1); //
    }
  } catch (error) {
    console.log("Failed to start the server", error);
  }
})();
