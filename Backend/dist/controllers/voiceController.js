"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceController = void 0;
const Lead_1 = require("../models/Lead");
const Transcript_1 = require("../models/Transcript");
const User_1 = require("../models/User");
class VoiceController {
    static async handleWebhook(req, res) {
        try {
            const { callerNumber, callerName, transcript, duration, sentiment, audioUrl, status } = req.body;
            console.log('Received Voice Webhook:', req.body);
            // 1. Resolve Business (For MVP, use the first admin user's business)
            // In production, this would use an API Key in headers
            const adminUser = await User_1.User.findOne({ role: 'admin' });
            if (!adminUser || !adminUser.businessId) {
                return res.status(500).json({ error: 'No configuration found' });
            }
            const businessId = adminUser.businessId;
            // Only process completed calls or specific statuses
            if (status === 'completed' || transcript) {
                // 2. Find or Create Lead
                let lead = await Lead_1.Lead.findOne({ businessId, phone: callerNumber });
                if (!lead && callerNumber) {
                    lead = await Lead_1.Lead.create({
                        businessId,
                        name: callerName || `Caller ${callerNumber}`,
                        phone: callerNumber,
                        email: '', // Unknown initially
                        status: 'new',
                        source: 'Voice Call',
                        score: 30, // Base score for calling
                        notes: 'Auto-created from Voice Call'
                    });
                    console.log('Created new lead from voice call:', lead._id);
                }
                else if (lead) {
                    // Update existing lead interaction time
                    lead.updatedAt = new Date();
                    await lead.save();
                }
                // 3. Create Transcript
                if (transcript) {
                    const callRecord = await Transcript_1.Transcript.create({
                        businessId,
                        leadId: lead?._id,
                        text: transcript,
                        audioUrl: audioUrl,
                        durationSeconds: duration || 0,
                        sentiment: sentiment || 'neutral',
                        intent: 'Inquiry', // Default, could be analyzed by AI
                        createdAt: new Date()
                    });
                    console.log('Saved Transcript:', callRecord._id);
                }
            }
            return res.json({ success: true, message: 'Webhook processed' });
        }
        catch (error) {
            console.error('Voice Webhook Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.VoiceController = VoiceController;
//# sourceMappingURL=voiceController.js.map