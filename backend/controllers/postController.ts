import { Response } from "express";
import Post from "../models/Post.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: AuthRequest, res: Response) => {
  const posts = await Post.find({})
    .populate("user", "name role")
    .populate("comments.user", "name role")
    .sort({ createdAt: -1 });
  res.json(posts);
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response) => {
  const { type, title, content, options, sentiment } = req.body;

  const post = new Post({
    user: req.user._id,
    type,
    title,
    content,
    options: options
      ? options.map((opt: string) => ({ text: opt, votes: [] }))
      : [],
    sentiment: sentiment || "neutral",
  });

  const createdPost = await post.save();
  const populatedPost = await Post.findById(createdPost._id).populate(
    "user",
    "name role",
  );

  // Real-time update removed; handled by polling on frontend.
  res.status(201).json(populatedPost);
};

// @desc    Vote on a post/poll
// @route   POST /api/posts/:id/vote
// @access  Private
export const votePost = async (req: AuthRequest, res: Response) => {
  const { optionId } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.type === "poll" && optionId) {
    // Check if user already voted
    let hasVoted = false;
    post.options.forEach((opt: any) => {
      if (
        opt.votes.some((v: any) => v.toString() === req.user._id.toString())
      ) {
        hasVoted = true;
      }
    });

    if (hasVoted) {
      res.status(400).json({ message: "You have already voted" });
      return;
    }

    const option = post.options.id(optionId);
    if (option) {
      (option as any).votes.push(req.user._id);
      await post.save();
      const updatedPost = await Post.findById(post._id)
        .populate("user", "name role")
        .populate("comments.user", "name role");
      // Real-time update removed; handled by polling on frontend.
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: "Option not found" });
    }
  } else if (post.type === "issue" || post.type === "discussion") {
    // Upvote issue or discussion
    if (
      post.upvotes.some((id: any) => id.toString() === req.user._id.toString())
    ) {
      post.upvotes = post.upvotes.filter(
        (id: any) => id.toString() !== req.user._id.toString(),
      );
    } else {
      post.upvotes.push(req.user._id);
    }
    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate("user", "name role")
      .populate("comments.user", "name role");
    // Real-time update removed; handled by polling on frontend.
    res.json(updatedPost);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Check if user is the author of the post
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "Not authorized to delete this post" });
      return;
    }

    await Post.deleteOne({ _id: post._id });
    // Real-time update removed; handled by polling on frontend.
    res.json({ message: "Post removed" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @route   POST /api/posts/:id/comment
// @access  Private
export const commentPost = async (req: AuthRequest, res: Response) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment as any);
    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate("user", "name role")
      .populate("comments.user", "name role");
    // Real-time update removed; handled by polling on frontend.
    res.status(201).json(updatedPost);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
};
