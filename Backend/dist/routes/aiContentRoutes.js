"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiCalendarController_1 = require("../controllers/aiCalendarController");
const router = (0, express_1.Router)();
// Generate 30-day text calendar
router.post("/calendar", aiCalendarController_1.generateCalendar);
// Get existing calendar
router.get("/calendar/:calendarId", aiCalendarController_1.getCalendar);
// Generate image for specific day (on-demand)
router.post("/calendar/:calendarId/day/:day/image", aiCalendarController_1.generateDayImage);
exports.default = router;
//# sourceMappingURL=aiContentRoutes.js.map