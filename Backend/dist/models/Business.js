"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Business = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const businessSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Business = mongoose_1.default.model('Business', businessSchema);
//# sourceMappingURL=Business.js.map