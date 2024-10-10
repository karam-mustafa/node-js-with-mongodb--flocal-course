const express = require("express");
const Post = require("../models/Posts");
const User = require("../models/User");
const Category = require("../models/Categories");
const authMiddleware = require("../middleware/auth");
const checkIfUserHasAccess = require("../middleware/checkIfUserHasAccess");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate("user_id").populate("category_id");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "category not found" });
  }

  try {
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      user_id: req.user._id,
      category_id: req.body.category_id,
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, checkIfUserHasAccess, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        category_id: req.body.category_id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, checkIfUserHasAccess, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
