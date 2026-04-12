import Post from '../models/Post.js';
import { io } from '../socket/socket.js';
// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    const posts = await Post.find({})
        .populate('user', 'name role')
        .populate('comments.user', 'name role')
        .sort({ createdAt: -1 });
    res.json(posts);
};
// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    const { type, title, content, options, sentiment } = req.body;
    const post = new Post({
        user: req.user._id,
        type,
        title,
        content,
        options: options ? options.map((opt) => ({ text: opt, votes: [] })) : [],
        sentiment: sentiment || 'neutral',
    });
    const createdPost = await post.save();
    const populatedPost = await Post.findById(createdPost._id).populate('user', 'name role');
    io.emit('new_post', populatedPost);
    res.status(201).json(populatedPost);
};
// @desc    Vote on a post/poll
// @route   POST /api/posts/:id/vote
// @access  Private
export const votePost = async (req, res) => {
    const { optionId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
    }
    if (post.type === 'poll' && optionId) {
        // Check if user already voted
        let hasVoted = false;
        post.options.forEach((opt) => {
            if (opt.votes.some((v) => v.toString() === req.user._id.toString())) {
                hasVoted = true;
            }
        });
        if (hasVoted) {
            res.status(400).json({ message: 'You have already voted' });
            return;
        }
        const option = post.options.id(optionId);
        if (option) {
            option.votes.push(req.user._id);
            await post.save();
            const updatedPost = await Post.findById(post._id).populate('user', 'name role').populate('comments.user', 'name role');
            io.emit('update_post', updatedPost);
            res.json(updatedPost);
        }
        else {
            res.status(404).json({ message: 'Option not found' });
        }
    }
    else if (post.type === 'issue' || post.type === 'discussion') {
        // Upvote issue or discussion
        if (post.upvotes.some((id) => id.toString() === req.user._id.toString())) {
            post.upvotes = post.upvotes.filter((id) => id.toString() !== req.user._id.toString());
        }
        else {
            post.upvotes.push(req.user._id);
        }
        await post.save();
        const updatedPost = await Post.findById(post._id).populate('user', 'name role').populate('comments.user', 'name role');
        io.emit('update_post', updatedPost);
        res.json(updatedPost);
    }
};
// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        // Check if user is the author of the post
        if (post.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized to delete this post' });
            return;
        }
        await Post.deleteOne({ _id: post._id });
        io.emit('delete_post', post._id);
        res.json({ message: 'Post removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// @route   POST /api/posts/:id/comment
// @access  Private
export const commentPost = async (req, res) => {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (post) {
        const comment = {
            user: req.user._id,
            text,
        };
        post.comments.push(comment);
        await post.save();
        const updatedPost = await Post.findById(post._id).populate('user', 'name role').populate('comments.user', 'name role');
        io.emit('update_post', updatedPost);
        res.status(201).json(updatedPost);
    }
    else {
        res.status(404).json({ message: 'Post not found' });
    }
};
//# sourceMappingURL=postController.js.map