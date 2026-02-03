"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voiceController_1 = require("../controllers/voiceController");
const router = (0, express_1.Router)();
// Public webhook endpoint (add middleware for API Key validation in prod)
router.post('/webhook', voiceController_1.VoiceController.handleWebhook);
exports.default = router;
//# sourceMappingURL=voice.routes.js.map