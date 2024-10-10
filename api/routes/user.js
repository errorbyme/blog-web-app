import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { createTokenForUser, validateToken } from "../services/auth.js";
import multer from "multer";
import path from "path";
import { Blog } from "../models/blog.js";
import { Comment } from "../models/comment.js";

const router = Router();
const salt = bcrypt.genSaltSync(10);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/pfpuploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.put("/pfpupdate", upload.single("pfp"), async (req, res) => {
  const { token } = req.cookies;
  if (!req.file) res.status(500).json({ message: "no pfp to set" });
  const img = req.file.filename;

  if (!token) return res.status(400).json({ message: "Not authorized." });
  try {
    const userInfo = validateToken(token);
    const user = await User.findById(userInfo._id);
    if (!user) res.status(400).json({ message: "Not authorized." });
    user.pfp = "pfpuploads/" + img;
    await user.save();
    const newToken = createTokenForUser(user);
    res.cookie("token", newToken, {
      httpOnly: true, // Helps prevent cross-site scripting attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "None", // Adjust based on your needs
    });
    return res.status(201).json({ message: "pfp updated" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.put("/profileupdate", async (req, res) => {
  const { token } = req.cookies;
  const { username, fullname } = req.body;

  if (!token) return res.status(400).json({ message: "Not authorized." });
  if (!username || !fullname) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username shud be at least of 3 chars." });
  }

  try {
    const userInfo = validateToken(token);
    const user = await User.findById(userInfo._id);
    if (!user) res.status(400).json({ message: "Not authorized." });
    user.username = username;
    user.fullname = fullname;
    await user.save();

    const newToken = createTokenForUser(user);
    res.cookie("token", newToken, {
      httpOnly: true, // Helps prevent cross-site scripting attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "None", // Adjust based on your needs
    });
    return res.status(201).json({ message: "profile updated" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/register", upload.single("file"), async (req, res) => {
  const { username, password, fullname } = req.body;
  let image = "default.png";
  if (req.file) {
    image = req.file.filename;
  }

  if (!username || !password || !fullname) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username shud be at least of 3 chars." });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username is already taken." });
  }

  try {
    const userDoc = await User.create({
      fullname,
      username,
      password: bcrypt.hashSync(password, salt),
      pfp: "pfpuploads/" + image,
    });
    return res.status(201).json({ message: "Registration successful" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(username, password);
    res.cookie("token", token, {
      httpOnly: true, // Helps prevent cross-site scripting attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "None", // Adjust based on your needs
    });
    return res.json({ message: "Login successful" });
  } catch (e) {
    if (e.message === "user not found" || e.message === "password incorrect")
      return res.status(400).json({ message: e.message });
    return res.status(400).json({ message: "Unexpected server error" });
  }
});

router.get("/auth", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json({ message: "Unauthorized" });
  const response = validateToken(token);
  if (!response) return res.json({ message: "Unauthorized" });
  return res.json(response);
});

router.post("/logout", (req, res) => {
  console.log("Initial cookies:", req.cookies); // Log current cookies
  res.clearCookie("token", { path: "/" }); // Clear the cookie
  console.log("Cookies after clear attempt:", req.cookies); // Log again after clearing
  return res.status(201).json("ok");
});

router.delete("/user", async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "Not authorized." });
  try {
    const userInfo = validateToken(token);
    const user = await User.findById(userInfo._id);
    if (!user) res.status(400).json({ message: "Not authorized." });

    const myblogs = await Blog.find({ createdBy: userInfo._id });
    const mycomments = await Comment.find({ commentBy: userInfo._id });

    if (myblogs) await Blog.deleteMany({ createdBy: userInfo._id });
    if (mycomments) await Comment.deleteMany({ commentBy: userInfo._id });

    await User.deleteOne({ _id: userInfo._id });
    return res.status(201).json({ message: "Account deleted successfully." });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
