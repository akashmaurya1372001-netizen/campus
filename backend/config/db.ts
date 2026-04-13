import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer | null = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Try to connect to provided MongoDB URI (Atlas or local)
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout faster
        connectTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error: any) {
      console.error(`Failed to connect to MongoDB: ${error.message}`);
      // Continue to fallback
    }
  }

  // Fallback to in-memory MongoDB
  try {
    console.log("Using in-memory MongoDB for development...");
    mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error starting in-memory MongoDB: ${error.message}`);
    process.exit(1);
  }
};
