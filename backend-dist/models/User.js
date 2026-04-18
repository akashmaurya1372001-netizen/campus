import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "professional"],
        default: "student",
    },
}, { timestamps: true });
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function () {
    const user = this;
    if (!user.isModified("password"))
        return;
    user.password = await bcrypt.hash(user.password, 10);
});
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=User.js.map