import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';

const router = Router();

// Public Brand Data (No Auth) - Used by Voice Microservice
router.get('/brand/:brandId', BusinessController.getPublicProfile);

export default router;
