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
            const { industryMode, description, location, brandVoice, visualStyle, competitors, voiceAgent, onboardingStep, knowledgeBase // Add knowledgeBase
             } = req.body;
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
                    ...(knowledgeBase && { knowledgeBase }), // Update knowledgeBase
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
    // Public Profile (For Voice Agent) - NO AUTH
    static async getPublicProfile(req, res) {
        try {
            const { brandId } = req.params;
            // Validate ID format
            if (!brandId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: 'Invalid Brand ID' });
            }
            const business = await Business_1.Business.findById(brandId)
                .select('name businessHours knowledgeBase location industry');
            if (!business)
                return res.status(404).json({ error: 'Business not found' });
            return res.json(business);
        }
        catch (error) {
            console.error('Public Profile Error:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    // Seed Database (Temporary)
    static async seedDatabase(_req, res) {
        try {
            // Option 1: Clear existing (Uncomment if needed)
            // await Business.deleteMany({});
            // Option 2: Create "Iron Flex Gym"
            const business = await Business_1.Business.create({
                name: "Iron Flex Gym",
                industryMode: "Gym",
                location: {
                    address: "123 Spartan Lane, Indirapuram, Ghaziabad", // Default location
                    city: "Ghaziabad",
                    country: "India"
                },
                knowledgeBase: {
                    businessHours: "Mon-Sun, 6 AM - 10 PM",
                    contactPhone: "+91-9876543210",
                    address: "123 Spartan Lane, Indirapuram, Ghaziabad", // Explicit Override
                    services: [
                        { name: "Membership", price: "₹1500/mo" },
                        { name: "Personal Training", price: "₹5000/mo" },
                        { name: "Day Pass", price: "₹200" }
                    ],
                    customInstructions: "You are an energetic gym receptionist. Be motivating. If they ask about diet, say we have a nutritionist on site. We are currently running a 'Summer Shred' offer with 20% off annual plans."
                },
                settings: {
                    language: "en-US",
                    timezone: "Asia/Kolkata"
                }
            });
            return res.json({
                message: "Database Seeded! Iron Flex Gym Created.",
                _id: business._id
            });
        }
        catch (error) {
            console.error('Seed Error:', error);
            return res.status(500).json({ error: 'Seeding failed' });
        }
    }
}
exports.BusinessController = BusinessController;
//# sourceMappingURL=business.controller.js.map