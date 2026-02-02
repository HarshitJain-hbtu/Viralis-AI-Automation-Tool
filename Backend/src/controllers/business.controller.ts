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
                name,
                logo, // Add logo field
                industryMode,
                description,
                location,
                brandVoice,
                visualStyle,
                competitors,
                voiceAgent,
                onboardingStep,
                knowledgeBase
            } = req.body;

            console.log(`📝 [Update Profile] Updating Business: ${req.user?.businessId}`);
            console.log('📦 Payload:', JSON.stringify({ ...req.body, logo: logo ? '[BASE64 IMAGE]' : undefined }, null, 2));

            // Sanitization Helper
            const removeEmpty = (obj: any) => {
                if (!obj || typeof obj !== 'object') return obj;
                Object.keys(obj).forEach(key => {
                    if (obj[key] === "" || obj[key] === null) {
                        delete obj[key];
                    } else if (typeof obj[key] === 'object') {
                        removeEmpty(obj[key]);
                    }
                });
                return obj;
            };

            // Deep copy and clean specific objects prone to enum errors
            const cleanBrandVoice = brandVoice ? removeEmpty(JSON.parse(JSON.stringify(brandVoice))) : undefined;
            const cleanLocation = location ? removeEmpty(JSON.parse(JSON.stringify(location))) : undefined;

            const business = await Business.findByIdAndUpdate(
                req.user?.businessId,
                {
                    $set: {
                        ...(name && { name }),
                        ...(logo !== undefined && { logo }), // Allow setting or clearing logo
                        ...(industryMode && { industryMode }),
                        ...(description && { description }),
                        ...(cleanLocation && Object.keys(cleanLocation).length > 0 && { location: cleanLocation }),
                        ...(cleanBrandVoice && Object.keys(cleanBrandVoice).length > 0 && { brandVoice: cleanBrandVoice }),
                        ...(visualStyle && { visualStyle }),
                        ...(competitors && { competitors }),
                        ...(voiceAgent && { voiceAgent }),
                        ...(onboardingStep !== undefined && { onboardingStep }),
                        ...(knowledgeBase && { knowledgeBase }),
                        ...(req.body.subscriptionTier && { subscriptionTier: req.body.subscriptionTier }),
                    }
                },
                { new: true, runValidators: true }
            );

            console.log(`✅ [Update Profile] Result Name: ${business?.name}`);
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
            console.log(`🔍 [Public API] Fetching Brand Profile: ${brandId}`);

            // Validate ID format
            if (!brandId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: 'Invalid Brand ID' });
            }

            const business = await Business.findById(brandId)
                .select('name businessHours knowledgeBase location industry industryMode brandVoice description');

            console.log(`✅ [Public API] Found Business: ${business?.name}`);
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
