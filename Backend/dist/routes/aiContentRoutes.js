"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiCalendarController_1 = require("../controllers/aiCalendarController");
const router = (0, express_1.Router)();
// POST /api/ai-content/calendar
// Generates a new 30-day content calendar
// This is a public route
router.post("/calendar", aiCalendarController_1.generateCalendar);
// GET /api/ai-content/calendar/:calendarId
// Retrieves a generated calendar by its ID
// This is a public route
router.get("/calendar/:calendarId", aiCalendarController_1.getCalendar);
exports.default = router;
//# sourceMappingURL=aiContentRoutes.js.map