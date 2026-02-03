"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const aiCalendarController_1 = require("../controllers/aiCalendarController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/generate', auth_middleware_1.authMiddleware, aiController_1.generateContent);
router.post('/generate-daily', auth_middleware_1.authMiddleware, aiCalendarController_1.generateDayContent);
router.post('/save-post', auth_middleware_1.authMiddleware, aiCalendarController_1.savePost);
router.get('/get-posts', auth_middleware_1.authMiddleware, aiCalendarController_1.getPosts);
router.post('/update-status', auth_middleware_1.authMiddleware, aiCalendarController_1.updatePostStatus);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map