"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Content_1 = require("../models/Content");
const VideoAnalysis_1 = require("../models/VideoAnalysis");
const Lead_1 = require("../models/Lead");
const mongodb_1 = require("../config/mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function seedMockData() {
    try {
        await (0, mongodb_1.connectMongoDB)();
        // 1. Find a valid Business ID (or create one if needed, but assuming one exists)
        // Since we don't have a reliable way to get a specific businessId without auth context, 
        // this script will requires passing a businessId or finding the first one.
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('Database connection failed');
        }
        const businesses = await db.collection('businesses').find().toArray();
        if (businesses.length === 0) {
            console.error('No business found. Please create a business first via the UI or another script.');
            process.exit(1);
        }
        console.log(`Found ${businesses.length} businesses. Seeding mock data for each...`);
        for (const business of businesses) {
            const businessId = business._id;
            console.log(`\n--- Seeding for Business: ${business.name} (${businessId}) ---`);
            // Check if mock data already exists for this business to avoid duplication
            const existingContent = await Content_1.Content.findOne({ businessId, 'meta.mock': true });
            if (existingContent) {
                console.log(`- Mock data already exists for ${business.name}. Skipping deletion but will add fresh analysis if needed.`);
            }
            // Clear existing mock data if desired (optional)
            // await Content.deleteMany({ businessId, meta: 'mock' });
            // await VideoAnalysis.deleteMany({ businessId });
            // 2. Create Mock Content (Videos/Posts)
            const mockVideos = [
                {
                    businessId,
                    title: 'Viral Success Strategy',
                    body: 'Unlocking the secrets to social media growth. Check out this new strategy! #Marketing #Growth #Viralis',
                    type: 'video',
                    platform: 'instagram',
                    status: 'published',
                    videoUrl: 'https://www.instagram.com/p/DUDevIVkvcF/',
                    platformPostId: 'DUDevIVkvcF',
                    platformAnalyzed: true,
                    analyzedAt: new Date(),
                    meta: { mock: true }
                },
                {
                    businessId,
                    title: 'How to Style Oversized Tees',
                    body: '3 simple ways to rock that oversized look. 👕 #StylingTips #Streetwear',
                    type: 'video',
                    platform: 'youtube',
                    status: 'published',
                    videoUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
                    platformPostId: 'dQw4w9WgXcQ',
                    platformAnalyzed: true,
                    analyzedAt: new Date(),
                    meta: { mock: true }
                }
            ];
            const savedVideos = await Content_1.Content.insertMany(mockVideos);
            console.log(`- Inserted ${savedVideos.length} mock videos.`);
            // 3. Create Mock Video Analyses
            const mockAnalyses = [
                {
                    businessId,
                    contentId: savedVideos[0]._id,
                    videoUrl: 'https://www.instagram.com/p/DUDevIVkvcF/',
                    platform: 'instagram',
                    platformStats: {
                        platform: 'instagram',
                        views: 85200,
                        likes: 4200,
                        comments: 312,
                        shares: 1540,
                        reach: 120000,
                        engagement: 6052,
                        engagementRate: 7.1,
                        fetchedAt: new Date()
                    },
                    aiSummary: 'A high-impact strategy video that directly addresses common marketing pain points.',
                    keyInsights: [
                        'Excellent hook in the first 2 seconds',
                        'Audience is highly engaged with the framework presented',
                        'Strong call to action leading to comment inquiries'
                    ],
                    audienceType: 'Digital Marketers and Entrepreneurs',
                    audienceSentiment: 'positive',
                    thumbnailUrl: 'https://scontent.cdninstagram.com/v/t51.2885-15/474812836_1130452375124045_6726896200259160565_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=18deecc&_nc_ohc=C9W6e8z8e3gAX-M4S6S&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=AM6V6_YBAAAA&_nc_gid=A_W0e8z8e3gAX-M4S6S&oh=00_AYC9W6e8z8e3gAX-M4S6S&oe=66000000', // Placeholder thumbnail
                    description: 'Complete breakdown of viral growth mechanics for 2026.',
                    leadQualityScore: 94,
                    analyzedAt: new Date()
                },
                {
                    businessId,
                    contentId: savedVideos[1]._id,
                    videoUrl: savedVideos[1].videoUrl,
                    platform: 'youtube',
                    platformStats: {
                        platform: 'youtube',
                        views: 45000,
                        likes: 3200,
                        comments: 180,
                        shares: 890,
                        reach: 50000,
                        engagement: 4270,
                        engagementRate: 9.5,
                        fetchedAt: new Date()
                    },
                    aiSummary: 'Educational and engaging. High retention rate segments during the tutorial parts.',
                    keyInsights: [
                        'Viewers re-watched the knotting technique',
                        'Comments asking about sizing availability',
                        'High conversion potential for the featured accessories'
                    ],
                    audienceType: 'Casual streetwear lovers',
                    audienceSentiment: 'positive',
                    leadQualityScore: 92,
                    thumbnailUrl: 'https://picsum.photos/seed/fashion2/400/600',
                    description: 'Educational short form video demonstrating styling techniques.',
                    analyzedAt: new Date()
                }
            ];
            await VideoAnalysis_1.VideoAnalysis.insertMany(mockAnalyses);
            console.log(`- Inserted ${mockAnalyses.length} mock analyses.`);
            // 4. Create Mock Leads
            const mockLeads = [
                {
                    businessId,
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    phone: '+1 234 567 8901',
                    status: 'qualified',
                    source: 'Instagram DM',
                    score: 88,
                    notes: 'Interested in the new summer collection. Highly engaged with reels.',
                    interactionHistory: [{ type: 'Inquiry', summary: 'Asked about size availability via DM.', date: new Date() }]
                }
            ];
            await Lead_1.Lead.insertMany(mockLeads);
            console.log(`- Inserted ${mockLeads.length} mock leads.`);
        }
        console.log('Mock seeding completed successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding mock data:', error);
        process.exit(1);
    }
}
seedMockData();
//# sourceMappingURL=seedMockLeads.js.map