import express from "express";
import Post from "../models/post.js";
// import { authMiddleware } from "../middleware/auth.js";  // ← Comment this out for now

const router = express.Router();

// GET all posts (public)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single post by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new post (remove authMiddleware for now)
router.post("/", async (req, res) => {  // ← Removed authMiddleware
  const post = new Post({
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    author: req.body.author || "Admin",
    imageUrl: req.body.imageUrl || "", // ✅ Added this line
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE post (remove authMiddleware for now)
router.put("/:slug", async (req, res) => {  // ← Removed authMiddleware
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.author = req.body.author || post.author;
    post.imageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : post.imageUrl; // ✅ Added this line

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE post (remove authMiddleware for now)
router.delete("/:slug", async (req, res) => {  // ← Removed authMiddleware
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;