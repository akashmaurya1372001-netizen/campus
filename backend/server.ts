import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { createServer as createHttpServer } from "http";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import connectDB  from "./config/db.ts";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  await connectDB();

  const app = express();
  const httpServer = createHttpServer(app);
  // Initialize Socket.io

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/users", userRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production setup
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Note: Express v4 uses '*'
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT as number, "0.0.0.0", () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });
};

startServer();
