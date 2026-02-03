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
exports.Content = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const contentSchema = new mongoose_1.Schema({
    businessId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
        type: String,
        enum: ['post', 'article', 'email', 'tweet', 'video'],
        required: true
    },
    platform: { type: String, enum: ['twitter', 'linkedin', 'email', 'blog', 'instagram', 'youtube'] },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'failed'],
        default: 'draft',
        index: true
    },
    scheduledFor: { type: Date },
    aiGenerated: { type: Boolean, default: false },
    videoUrl: { type: String },
    platformPostId: { type: String, index: true },
    platformAnalyzed: { type: Boolean, default: false },
    analyzedAt: { type: Date },
    meta: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.Content = mongoose_1.default.model('Content', contentSchema);
//# sourceMappingURL=Content.js.map