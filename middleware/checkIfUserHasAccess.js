const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Posts");

const checkIfUserHasAccess = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // this post?.user_id will return object, so we want to convert it to string 
    if (post?.user_id?.toString() == req.user._id.toString()) {
      next(); // Move to the next middleware
    } else {
      // autorization
      res.status(403).json({ message: "You can not edit this post" });
    }

  } catch (error) {
    // authentication
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = checkIfUserHasAccess;
