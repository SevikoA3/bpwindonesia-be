import { Router } from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const blogRouter = Router();

blogRouter.get("/", verifyToken, getBlogs);
blogRouter.get("/:id", verifyToken, getBlogById);
blogRouter.post("/", verifyToken, createBlog);
blogRouter.put("/:id", verifyToken, updateBlog);
blogRouter.delete("/:id", verifyToken, deleteBlog);

export default blogRouter;
