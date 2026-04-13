import { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import User from "../../../backend/models/User";
import generateToken from "../../../backend/utils/generateToken";

let conn: typeof mongoose | null = null;
async function connectDB() {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI!);
  return conn;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  if (req.method === "POST") {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists." });
      }
      const user = await User.create({ name, email, password, role });
      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()),
        });
      } else {
        return res.status(400).json({ message: "Invalid user data." });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
