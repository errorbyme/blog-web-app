import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    coverImageURL: { type: String, required: false },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    categories: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

export { Blog };
