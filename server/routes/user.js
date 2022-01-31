const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const User = require("../models/user.model");
const Blog = require("../models/blog.model");

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

Router.post("/data", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res
      .status(200)
      .send({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
});

Router.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const blogs = await Blog.find({ author_id: user._id });
    const likedBlogs = await Blog.find({ likes: decoded._id });
    return res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      blogs: blogs,
      likedBlogs: likedBlogs,
    });
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
});

Router.get("/posts", async (req, res) => {
  const blogs = await Blog.find({});
  return res.status(200).send({ blogs: blogs });
});

Router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const blogs = await Blog.find({ title: { $regex: query, $options: "i" } });
  return res.status(200).send({ blogs: blogs });
});

Router.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    return res.status(200).send({ blog: blog });
  } catch (err) {
    return res.status(404).send({ error: "Blog not found" });
  }
});

Router.post("/post/like/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send({ error: "Blog not found" });
  }
  blog.likes.push(user_id);
  await blog.save();
  return res.status(200).send({ blog: blog });
});

Router.post("/post/unlike/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send({ error: "Blog not found" });
  }
  const index = blog.likes.indexOf(user_id);
  blog.likes.splice(index, 1);
  await blog.save();
  return res.status(200).send({ blog: blog });
});

Router.post("/post/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, comment } = req.body;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send({ error: "Blog not found" });
  }
  const user = await User.findById(user_id);
  blog.comments.push({
    name: user.name,
    comment: comment,
    date: new Date(),
  });
  await blog.save();
  return res.status(200).send({ blog: blog });
});

Router.post("/create", upload.single("image"), async (req, res) => {
  const { title, content, date, token } = req.body;

  if (req.file) {
    cloudinary.uploader.upload(
      req.file.path,
      { folder: "bugblog" },
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Internal server error",
          });
        }
        const image = result.secure_url;
        const cloudinaryId = result.public_id;
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded._id);
          if (!user) {
            return res.status(404).send({ error: "User not found" });
          }
          const blog = new Blog({
            title,
            content,
            image,
            cloudinaryId,
            author: user.name,
            author_id: user._id,
            created_at: date,
          });
          await blog.save();
          user.blogs.push(blog._id);
          await user.save();
          return res.status(200).send({
            message: "Blog created successfully",
          });
        } catch (err) {
          return res.status(401).send({ error: "Invalid token" });
        }
      }
    );
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const blog = new Blog({
        title,
        content,
        author: user.name,
        author_id: user._id,
        created_at: date,
      });
      await blog.save();
      user.blogs.push(blog._id);
      await user.save();
      return res.status(200).send({
        message: "Blog created successfully",
      });
    } catch (err) {
      return res.status(401).send({ error: "Invalid token" });
    }
  }
});

Router.post("/edit", upload.single("image"), async (req, res) => {
  const { title, content, date, id, token, image } = req.body;
  if (req.file) {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    if (blog.image) {
      cloudinary.uploader.destroy(blog.cloudinaryId, async (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Internal server error",
          });
        }
      });
    }
    cloudinary.uploader.upload(
      req.file.path,
      { folder: "bugblog" },
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Internal server error",
          });
        }
        const image = result.secure_url;
        const cloudinaryId = result.public_id;
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded._id);
          if (!user) {
            return res.status(404).send({ error: "User not found" });
          }
          const blog = await Blog.findById(id);
          if (!blog) {
            return res.status(404).send({ error: "Blog not found" });
          }
          if (blog.author_id.toString() !== user._id.toString()) {
            return res.status(401).send({ error: "Unauthorized" });
          }
          blog.title = title;
          blog.content = content;
          blog.image = image;
          blog.cloudinaryId = cloudinaryId;
          blog.created_at = date;
          await blog.save();
          return res.status(200).send({
            message: "Blog updated successfully",
          });
        } catch (err) {
          return res.status(401).send({ error: "Invalid token" });
        }
      }
    );
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).send({ error: "Blog not found" });
      }
      if (blog.author_id.toString() !== user._id.toString()) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      if (blog.image && image==="null") {
        cloudinary.uploader.destroy(blog.cloudinaryId, async (err, result) => {
          if (err) {
            return res.status(500).json({
              error: "Internal server error",
            });
          }
        });
        blog.image = null;
        blog.cloudinaryId = null;
      }
      blog.title = title;
      blog.content = content;
      blog.created_at = date;
      await blog.save();
      return res.status(200).send({
        message: "Blog updated successfully",
      });
    } catch (err) {
      return res.status(401).send({ error: "Invalid token" });
    }
  }
});

Router.post("/delete", upload.single("image"), async (req, res) => {
  const { id, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    const index = user.blogs.indexOf(id);
    user.blogs.splice(index, 1);
    await user.save();
    if (blog.cloudinaryId) {
      cloudinary.uploader.destroy(blog.cloudinaryId, (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Internal server error",
          });
        }
      });
    }
    await blog.remove();
    const blogs = await Blog.find({ author_id: user._id });
    const likedBlogs = await Blog.find({ likes: decoded._id });
    return res.status(200).send({
      blogs: blogs,
      likedBlogs: likedBlogs,
    });
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
});

module.exports = Router;
