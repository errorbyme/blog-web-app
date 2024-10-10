import mongoose from "mongoose";
import { createTokenForUser } from "../services/auth.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true, min: 3 },
    password: { type: String, required: true },
    pfp: { type: String, default: "default.png" },
  },
  { timestamps: true }
);

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) throw new Error("user not found");
    const isTrue = bcrypt.compareSync(password, user.password);
    if (!isTrue) throw new Error("password incorrect");
    const token = createTokenForUser(user);
    return token;
  }
);

const User = mongoose.model("user", userSchema);

export { User };
