import { Router } from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const blogRouter = Router();

blogRouter.get("/", verifyToken, getBlogs);
blogRouter.get("/:id", verifyToken, getBlogById);
blogRouter.post("/", verifyToken, upload.single("coverImage"), createBlog);
blogRouter.put("/:id", verifyToken, upload.single("coverImage"), updateBlog);
blogRouter.delete("/:id", verifyToken, deleteBlog);

export default blogRouter;
