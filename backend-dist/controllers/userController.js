import User from '../models/User.js';
import Post from '../models/Post.js';
// @desc    Get user profile and their posts
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            const posts = await Post.find({ user: req.user._id })
                .populate('user', 'name role')
                .populate('comments.user', 'name role')
                .sort({ createdAt: -1 });
            res.json({ user, posts });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
//# sourceMappingURL=userController.js.map