import express from 'express';
import { getPosts, createPost, votePost, commentPost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').delete(protect, deletePost);
router.route('/:id/vote').post(protect, votePost);
router.route('/:id/comment').post(protect, commentPost);
export default router;
//# sourceMappingURL=postRoutes.js.map