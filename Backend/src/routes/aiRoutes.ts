import express from 'express';
import { generateContent } from '../controllers/aiController';
import { generateDayContent, savePost, getPosts, updatePostStatus } from '../controllers/aiCalendarController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();


router.post('/generate', authMiddleware, generateContent);
router.post('/generate-daily', authMiddleware, generateDayContent as any);


router.post('/save-post', authMiddleware, savePost as any);
router.get('/get-posts', authMiddleware, getPosts as any);
router.post('/update-status', authMiddleware, updatePostStatus as any);

export default router;
