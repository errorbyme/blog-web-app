import { Router } from "express";
import { Comment } from "../models/comment.js";
import { Blog } from "../models/blog.js";
import { validateToken } from "../services/auth.js";
const router = Router();

router.post("/comments", async (req, res) => {
  const { blogId } = req.body;
  try {
    const allComments = await Comment.find({ blogId }).populate("commentBy", [
      "username",
      "pfp",
    ]);

    if (allComments.length == 0) return res.json([]);
    return res.status(201).json(allComments);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/comment", async (req, res) => {
  const { blogId, comment } = req.body;
  const { token } = req.cookies;
  if (!token) return res.status(400).json({ message: "Not authorized." });
  if (!comment) return res.status(400).json({ message: "Comment is empty." });

  try {
    const userInfo = validateToken(token);
    const BlogDoc = await Blog.findById(blogId);
    if (!BlogDoc)
      return res.status(400).json({ message: "You arent commenting on blog" });
    const addComment = await Comment.create({
      comment,
      blogId,
      commentBy: userInfo._id,
    });
    return res.status(201).json({ message: "success" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/comment/:id", async (req, res) => {
  const id = req.params.id;
  const { token } = req.cookies;
  if (!token) return res.status(400).json({ message: "Not authorized." });

  try {
    const userInfo = validateToken(token);
    const comment = await Comment.findById(id);
    if (!comment) return res.status(400).json({ message: "comment not found" });

    const isTrue =
      JSON.stringify(comment.commentBy) === JSON.stringify(userInfo._id);

    if (!isTrue)
      return res.status(500).json({ message: "You are not the actual author" });
    await comment.deleteOne({ _id: id });
    return res.status(201).json({ message: "success deletd comment" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.put("/comment/:id", async (req, res) => {
  const id = req.params.id;
  const { updatedcomment } = req.body;

  const { token } = req.cookies;
  if (!token) return res.status(400).json({ message: "Not authorized." });

  try {
    const userInfo = validateToken(token);
    const comment = await Comment.findById(id);
    if (!comment) return res.status(400).json({ message: "comment not found" });

    const isTrue =
      JSON.stringify(comment.commentBy) === JSON.stringify(userInfo._id);

    if (!isTrue)
      return res.status(500).json({ message: "You are not the actual author" });

    await comment.updateOne({ comment: updatedcomment });
    return res.status(201).json({ message: "success updated comment" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
