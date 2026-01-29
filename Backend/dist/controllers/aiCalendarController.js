"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCalendar = generateCalendar;
const aiContentService_1 = require("../utils/aiContentService");
async function generateCalendar(req, res) {
    try {
        const plan = await (0, aiContentService_1.generate30DayCalendar)(req.body);
        res.json(plan);
    }
    catch (error) {
        console.error('Calendar error:', error);
        res.status(500).json({ error: 'Failed to generate calendar' });
    }
}
//# sourceMappingURL=aiCalendarController.js.map