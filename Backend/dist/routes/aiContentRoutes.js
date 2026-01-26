"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiContentController_1 = require("../controllers/aiContentController");
const router = (0, express_1.Router)();
router.post('/ai-content', aiContentController_1.createAiContent);
router.post('/ai-content/30-days', aiContentController_1.create30DayCalendar);
exports.default = router;
//# sourceMappingURL=aiContentRoutes.js.map