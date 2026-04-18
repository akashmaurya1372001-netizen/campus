import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "professional";
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "professional"],
      default: "student",
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (
  enteredPassword: string
) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  const user = this as any;

  if (!user.isModified("password")) return;

  user.password = await bcrypt.hash(user.password, 10);
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;