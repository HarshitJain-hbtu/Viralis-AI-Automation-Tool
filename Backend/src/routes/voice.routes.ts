import { Router } from 'express';
import { VoiceController } from '../controllers/voiceController';
import { handleVoiceChatMessage } from '../controllers/webCallController';

const router = Router();

// Public webhook endpoint (add middleware for API Key validation in prod)
router.post('/webhook', VoiceController.handleWebhook);

// REST fallback for conversational chat queries
router.post('/chat-message', handleVoiceChatMessage as any);

export default router;
