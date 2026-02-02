import { Router } from 'express';
import { VoiceController } from '../controllers/voiceController';

const router = Router();

// Public webhook endpoint (add middleware for API Key validation in prod)
router.post('/webhook', VoiceController.handleWebhook);

export default router;
