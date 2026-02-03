"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create30DayCalendar = create30DayCalendar;
exports.createAiContent = createAiContent;
const aiContentService_1 = require("../utils/aiContentService");
const logger_1 = __importDefault(require("../utils/logger"));
async function create30DayCalendar(req, res) {
    try {
        const { niche, city, platform } = req.body;
        if (!niche || !city || !platform) {
            return res
                .status(400)
                .json({ error: 'niche, city, and platform are required' });
        }
        const result = await (0, aiContentService_1.generate30DayCalendar)({ niche, city, platform });
        return res.json(result);
    }
    catch (error) {
        logger_1.default.error('Error in create30DayCalendar controller', {
            error: error.message,
            requestBody: req.body,
        });
        return res
            .status(500)
            .json({ error: 'Failed to generate 30-day calendar', message: error.message });
    }
}
async function createAiContent(req, res) {
    try {
        const { niche, city, platform } = req.body;
        // Note: 'date' and 'context' would typically come from request or DB. Using defaults for now.
        if (!niche || !city || !platform) {
            return res
                .status(400)
                .json({ error: 'niche, city, and platform are required' });
        }
        const result = await (0, aiContentService_1.generateDailyPost)({ niche, city, platform, date: new Date().toISOString().split('T')[0], context: { last7DaysContent: [], recentStats: 'No stats available', brandPositioning: 'Generic' } });
        return res.json(result);
    }
    catch (error) {
        logger_1.default.error('Error in createAiContent controller', {
            error: error.message,
            requestBody: req.body,
        });
        return res
            .status(500)
            .json({ error: 'Failed to generate AI content', message: error.message });
    }
}
//# sourceMappingURL=aiContentController.js.map