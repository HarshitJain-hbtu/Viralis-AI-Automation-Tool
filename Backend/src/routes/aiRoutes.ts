import express from 'express';
import { generateContent } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/generate', authMiddleware, generateContent);

export default router;
