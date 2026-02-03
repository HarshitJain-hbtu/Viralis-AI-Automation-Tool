import mongoose, { Document } from 'mongoose';
export interface IBusiness extends Document {
    name: string;
    logo?: string;
    industry?: string;
    industryMode?: string;
    website?: string;
    description?: string;
    location?: {
        city?: string;
        country?: string;
        address?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    brandVoice?: {
        tone: 'Professional' | 'Friendly' | 'Witty' | 'Urgent';
        keywords?: string[];
        avoidKeywords?: string[];
        exampleContent?: string;
    };
    contentPreferences?: {
        frequency: 'Daily' | 'Weekly' | 'Bi-Weekly';
        preferredTypes: string[];
        language: string;
    };
    visualStyle?: {
        colorPalette?: string[];
        logoUrl?: string;
        imageStyle?: 'Realistic' | 'Illustration' | 'Minimalist';
    };
    voiceAgent?: {
        isEnabled: boolean;
        greeting?: string;
        voiceId?: string;
        faq?: Array<{
            question: string;
            answer: string;
        }>;
        bookingLink?: string;
    };
    competitors?: Array<{
        name: string;
        website?: string;
        socialHandles?: {
            instagram?: string;
            facebook?: string;
        };
    }>;
    settings: {
        timezone: string;
        language: string;
    };
    onboardingStep: number;
    apiKeys: {
        gemini?: string;
        deepgram?: string;
        twilio?: string;
    };
    knowledgeBase?: {
        businessHours?: string;
        contactPhone?: string;
        address?: string;
        services?: Array<{
            name: string;
            price: string;
        }>;
        customInstructions?: string;
    };
    subscriptionTier: 'Free' | 'Starter' | 'Business';
    createdAt: Date;
    updatedAt: Date;
}
declare const Business: mongoose.Model<IBusiness, {}, {}, {}, mongoose.Document<unknown, {}, IBusiness, {}, {}> & IBusiness & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export { Business };
//# sourceMappingURL=Business.d.ts.map