import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  // ✅ CORS (FIXED)
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://campus-two-beta.vercel.app"
      ],
      credentials: true,
    })
  );

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/users", userRoutes);

  // health route
  app.get("/", (req, res) => {
    res.send("Campus API running");
  });

  app.use(notFound);
  app.use(errorHandler);

  const PORT = Number(process.env.PORT) || 10000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();