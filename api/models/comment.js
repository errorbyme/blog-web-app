import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "blog" },
    commentBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

export { Comment };
