import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware); // Protect all routes

router.get('/profile', BusinessController.getProfile);
router.patch('/profile', BusinessController.updateProfile);

export default router;
