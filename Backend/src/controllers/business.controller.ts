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
                onboardingStep,
                knowledgeBase // Add knowledgeBase
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
                        ...(knowledgeBase && { knowledgeBase }), // Update knowledgeBase
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

    // Public Profile (For Voice Agent) - NO AUTH
    static async getPublicProfile(req: Request, res: Response) {
        try {
            const { brandId } = req.params;
            
            // Validate ID format
            if (!brandId.match(/^[0-9a-fA-F]{24}$/)) {
                 return res.status(400).json({ error: 'Invalid Brand ID' });
            }

            const business = await Business.findById(brandId)
                .select('name businessHours knowledgeBase location industry');

            if (!business) return res.status(404).json({ error: 'Business not found' });
            return res.json(business);
        } catch (error) {
            console.error('Public Profile Error:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    // Seed Database (Temporary)
    static async seedDatabase(_req: Request, res: Response) {
        try {
            // Option 1: Clear existing (Uncomment if needed)
            // await Business.deleteMany({});

            // Option 2: Create "Iron Flex Gym"
            const business = await Business.create({
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

        } catch (error) {
            console.error('Seed Error:', error);
            return res.status(500).json({ error: 'Seeding failed' });
        }
    }
}
