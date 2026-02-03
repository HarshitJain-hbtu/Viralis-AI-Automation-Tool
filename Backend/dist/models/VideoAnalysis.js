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
exports.VideoAnalysis = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const videoAnalysisSchema = new mongoose_1.Schema({
    businessId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    contentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    videoUrl: { type: String, required: true },
    platform: {
        type: String,
        enum: ['instagram', 'youtube'],
        required: true,
        index: true
    },
    platformStats: {
        platform: { type: String, enum: ['instagram', 'youtube'], required: true },
        views: { type: Number },
        likes: { type: Number },
        comments: { type: Number },
        shares: { type: Number },
        impressions: { type: Number },
        reach: { type: Number },
        saves: { type: Number },
        engagement: { type: Number },
        engagementRate: { type: Number },
        fetchedAt: { type: Date, default: Date.now }
    },
    aiSummary: { type: String },
    keyInsights: [{ type: String }],
    audienceType: { type: String },
    audienceSentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'mixed']
    },
    topicsMentioned: [{ type: String }],
    recommendations: [{ type: String }],
    thumbnailUrl: { type: String },
    description: { type: String },
    leadQualityScore: { type: Number, min: 0, max: 100 },
    analyzedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.VideoAnalysis = mongoose_1.default.model('VideoAnalysis', videoAnalysisSchema);
//# sourceMappingURL=VideoAnalysis.js.map