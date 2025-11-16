import { Router } from "express";

// Auth routes
import authRoutes from "@/routes/v1/auth";

// User routes
import userRoutes from "@/routes/v1/user";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Blog API",
    status: "ok",
    version: "1.0.0",
    docs: "",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
