import { Request, Response } from 'express';
import { Business } from '../models/Business';
import logger from '../utils/logger';

export class BusinessController {

    // Get current business profile
    static async getProfile(req: Request, res: Response) {
        try {
            const business = await Business.findById(req.user?.businessId);
            if (!business) return res.status(404).json({ error: 'Business not found' });
            return res.json(business);
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Update business profile
    static async updateProfile(req: Request, res: Response) {
        try {
            const {
                industryMode,
                description,
                location,
                brandVoice,
                visualStyle,
                competitors,
                voiceAgent,
                onboardingStep
            } = req.body;

            const business = await Business.findByIdAndUpdate(
                req.user?.businessId,
                {
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
                },
                { new: true, runValidators: true }
            );

            if (!business) return res.status(404).json({ error: 'Business not found' });
            return res.json(business);
        } catch (error) {
            logger.error('Update Business error:', error);
            return res.status(500).json({ error: 'Update failed' });
        }
    }
}
