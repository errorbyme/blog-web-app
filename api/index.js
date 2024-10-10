import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import commentRouter from "./routes/comment.js";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
});
const PORT = process.env.PORT || 9999;
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.resolve("./public")));

app.use(userRouter);
app.use(blogRouter);
app.use(commentRouter);

app.listen(PORT, () => console.log("Server started at", PORT));

// mongodb+srv://blog:HJdsIuc1rIYd5bjq@cluster0.audua.mongodb.net/
