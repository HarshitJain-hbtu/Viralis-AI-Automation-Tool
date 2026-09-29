"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voiceController_1 = require("../controllers/voiceController");
const webCallController_1 = require("../controllers/webCallController");
const router = (0, express_1.Router)();
// Public webhook endpoint (add middleware for API Key validation in prod)
router.post('/webhook', voiceController_1.VoiceController.handleWebhook);
// REST fallback for conversational chat queries
router.post('/chat-message', webCallController_1.handleVoiceChatMessage);
exports.default = router;
//# sourceMappingURL=voice.routes.js.map