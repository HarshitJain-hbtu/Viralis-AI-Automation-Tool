import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
    name: string;
    industry?: string;
    industryMode?: 'Dentist' | 'Gym' | 'Real Estate' | 'Salon' | 'Cafe' | 'Other';
    website?: string;
    description?: string;

    // Location (Local SEO)
    location?: {
        city?: string;
        country?: string;
        address?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };

    // Brand Voice & Content
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

    // Visuals
    visualStyle?: {
        colorPalette?: string[];
        logoUrl?: string;
        imageStyle?: 'Realistic' | 'Illustration' | 'Minimalist';
    };

    // AI Agent
    voiceAgent?: {
        isEnabled: boolean;
        greeting?: string;
        voiceId?: string;
        faq?: Array<{ question: string; answer: string }>;
        bookingLink?: string;
    };

    // Intelligence
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

    onboardingStep: number; // 0=New, 1=Profile, 2=AI, 3=Done

    apiKeys: {
        gemini?: string;
        deepgram?: string;
        twilio?: string;
    };

    // AI Knowledge Base
    knowledgeBase?: {
        businessHours?: string;
        contactPhone?: string;
        address?: string;
        services?: Array<{ name: string; price: string }>;
        customInstructions?: string;
    };

    subscriptionTier: 'Free' | 'Starter' | 'Business';

    createdAt: Date;
    updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
    {
        name: { type: String, required: true },
        industry: { type: String },
        industryMode: {
            type: String,
            enum: ['Dentist', 'Gym', 'Real Estate', 'Salon', 'Cafe', 'Other'],
            default: 'Other'
        },
        website: { type: String },
        description: { type: String },

        location: {
            city: String,
            country: String,
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },

        brandVoice: {
            tone: { type: String, enum: ['Professional', 'Friendly', 'Witty', 'Urgent'] },
            keywords: [String],
            avoidKeywords: [String],
            exampleContent: String
        },

        contentPreferences: {
            frequency: { type: String, enum: ['Daily', 'Weekly', 'Bi-Weekly'], default: 'Daily' },
            preferredTypes: [String],
            language: { type: String, default: 'en-US' }
        },

        visualStyle: {
            colorPalette: [String],
            logoUrl: String,
            imageStyle: { type: String, enum: ['Realistic', 'Illustration', 'Minimalist'] }
        },

        voiceAgent: {
            isEnabled: { type: Boolean, default: false },
            greeting: String,
            voiceId: String,
            faq: [{ question: String, answer: String }],
            bookingLink: String
        },

        competitors: [{
            name: String,
            website: String,
            socialHandles: {
                instagram: String,
                facebook: String
            }
        }],

        settings: {
            timezone: { type: String, default: 'UTC' },
            language: { type: String, default: 'en-US' },
        },

        onboardingStep: { type: Number, default: 0 },

        apiKeys: {
            gemini: String,
            deepgram: String,
            twilio: String,
        },

        knowledgeBase: {
            businessHours: String,
            contactPhone: String,
            address: String,
            services: [{ name: String, price: String }],
            customInstructions: String
        },

        subscriptionTier: {
            type: String,
            enum: ['Free', 'Starter', 'Business'],
            default: 'Free'
        }
    },
    { timestamps: true }
);

const Business = mongoose.model<IBusiness>('Business', businessSchema);
export { Business };
