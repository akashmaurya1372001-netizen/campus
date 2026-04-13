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
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }
    try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()),
        });
      } else {
        return res.status(401).json({ message: "Invalid email or password." });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
