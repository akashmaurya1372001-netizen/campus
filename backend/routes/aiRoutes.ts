import express from 'express';
import { analyzeSentiment, generatePoll, moderateComment } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeSentiment);
router.post('/generate-poll', protect, generatePoll);
router.post('/moderate', protect, moderateComment);

export default router;
