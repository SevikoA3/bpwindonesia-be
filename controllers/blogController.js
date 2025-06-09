import Blog from "../models/Blog.js";
import cloudinary from "../util/cloudinary.js";
import streamifier from "streamifier";

async function streamUpload(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({ include: "blogAuthor" });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, { include: "blogAuthor" });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Cover image is required" });
    }
    const uploadResult = await streamUpload(req.file.buffer, {
      folder: "blog_covers",
      unique_filename: true,
      overwrite: true,
    });
    const coverImage = uploadResult.secure_url;
    const blog = await Blog.create({ title, content, authorId, coverImage });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    let coverImage = blog.coverImage;
    if (req.file) {
      // Delete old cover from Cloudinary if exists
      if (coverImage) {
        try {
          const urlParts = coverImage.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const publicId = fileName.split(".")[0];
          await cloudinary.uploader.destroy(`blog_covers/${publicId}`);
        } catch (cloudErr) {
          console.error("Cloudinary deletion error:", cloudErr);
        }
      }
      const uploadResult = await streamUpload(req.file.buffer, {
        folder: "blog_covers",
        unique_filename: true,
        overwrite: true,
      });
      coverImage = uploadResult.secure_url;
    }
    await blog.update({ title, content, authorId, coverImage });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    // Delete cover image from Cloudinary if exists
    if (blog.coverImage) {
      try {
        const urlParts = blog.coverImage.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split(".")[0];
        await cloudinary.uploader.destroy(`blog_covers/${publicId}`);
      } catch (cloudErr) {
        console.error("Cloudinary deletion error:", cloudErr);
      }
    }
    await blog.destroy();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
