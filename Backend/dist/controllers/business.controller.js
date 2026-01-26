"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const Business_1 = require("../models/Business");
const logger_1 = __importDefault(require("../utils/logger"));
class BusinessController {
    // Get current business profile
    static async getProfile(req, res) {
        try {
            const business = await Business_1.Business.findById(req.user?.businessId);
            if (!business)
                return res.status(404).json({ error: 'Business not found' });
            return res.json(business);
        }
        catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }
    // Update business profile
    static async updateProfile(req, res) {
        try {
            const { industryMode, description, location, brandVoice, visualStyle, competitors, voiceAgent, onboardingStep } = req.body;
            const business = await Business_1.Business.findByIdAndUpdate(req.user?.businessId, {
                $set: {
                    ...(industryMode && { industryMode }),
                    ...(description && { description }),
                    ...(location && { location }),
                    ...(brandVoice && { brandVoice }),
                    ...(visualStyle && { visualStyle }),
                    ...(competitors && { competitors }),
                    ...(voiceAgent && { voiceAgent }),
                    ...(onboardingStep !== undefined && { onboardingStep }),
                }
            }, { new: true, runValidators: true });
            if (!business)
                return res.status(404).json({ error: 'Business not found' });
            return res.json(business);
        }
        catch (error) {
            logger_1.default.error('Update Business error:', error);
            return res.status(500).json({ error: 'Update failed' });
        }
    }
}
exports.BusinessController = BusinessController;
//# sourceMappingURL=business.controller.js.map