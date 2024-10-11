import { Router } from "express";
import { Blog } from "../models/blog.js";
import multer from "multer";
import path from "path";
import { validateToken } from "../services/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/coveruploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.post("/createblog", upload.single("coverImageURL"), async (req, res) => {
  const { title, content, userid, summary } = req.body;
  const categories = req.body.categories;

  if (!title || !content || !summary || !req.file)
    return res.status(400).json({ message: "All fields are required." });

  let image = req.file.filename;
  try {
    const blogDoc = await Blog.create({
      title,
      summary,
      content,
      createdBy: userid,
      categories,
      coverImageURL: "coveruploads/" + image,
    });
    return res.status(201).json({ message: "Blog created successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", ["fullname", "pfp"]);
    if (allBlogs.length == 0) return res.json([]);
    return res.status(201).json(allBlogs);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/myblogs", async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "Not authorized." });

  try {
    const userInfo = validateToken(token);
    const blogs = await Blog.find({ createdBy: userInfo._id }).sort({
      createdAt: -1,
    });
    if (blogs.length == 0) return res.json([]);
    return res.status(201).json(blogs);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/blog", async (req, res) => {
  const { id } = req.body;

  try {
    const blog = await Blog.findById(id).populate("createdBy", [
      "fullname",
      "username",
      "pfp",
    ]);
    if (!blog) return res.status(400).json({ message: "check the url" });
    blog.views += 1;
    await blog.save();
    return res.status(201).json(blog);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/blog", upload.single("coverImageURL"), async (req, res) => {
  const { title, content, id, summary } = req.body;
  let nimage = null;
  let categories = req.body.categories;
  if (!categories) categories = [];

  if (req.file) nimage = req.file.filename;

  if (!title || !content || !summary)
    return res
      .status(400)
      .json({ message: "Title and Description cant be empty" });

  const { token } = req.cookies;

  try {
    const userInfo = validateToken(token);
    const BlogDoc = await Blog.findById(id);
    const isTrue =
      JSON.stringify(BlogDoc.createdBy) === JSON.stringify(userInfo._id);

    if (!isTrue)
      return res.status(400).json({ message: "You are not the actual author" });
    await BlogDoc.updateOne({
      title,
      summary,
      content,
      categories,
      coverImageURL: nimage ? "coveruploads/" + nimage : BlogDoc.coverImageURL,
    });
    return res.status(201).json({ message: "sucess." });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.delete("/blog", async (req, res) => {
  const { id } = req.body;
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "Not authorized." });
  try {
    const userInfo = validateToken(token);
    const BlogDoc = await Blog.findById(id);
    const isTrue =
      JSON.stringify(BlogDoc.createdBy) === JSON.stringify(userInfo._id);

    if (!isTrue)
      return res.status(500).json({ message: "You are not the actual author" });
    await Blog.deleteOne({ _id: id });
    return res.status(201).json({ message: "Blog deleted successfully." });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/likeBlog/:id", async (req, res) => {
  const id = req.params.id;
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "Not authorized." });
  try {
    const userInfo = validateToken(token);
    const BlogDoc = await Blog.findById(id);
    if (BlogDoc.likes.includes(JSON.stringify(userInfo._id))) {
      BlogDoc.likes = BlogDoc.likes.filter(
        (uid) => uid !== JSON.stringify(userInfo._id)
      );
      await BlogDoc.save();
      return res.status(201).json({ message: "Blog unLiked." });
    } else {
      BlogDoc.likes.push(JSON.stringify(userInfo._id));
      await BlogDoc.save();
      return res.status(201).json({ message: "Blog Liked." });
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
