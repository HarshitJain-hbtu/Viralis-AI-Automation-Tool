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
exports.getRecentPosts = exports.getCalendarStats = exports.updatePostStatus = exports.getPosts = exports.savePost = exports.generateDayContent = exports.getCalendar = exports.generateCalendar = void 0;
const uuid_1 = require("uuid");
const aiContentService_1 = require("../utils/aiContentService");
// In-memory store for this prototype. In production, use a database like Redis or a persistent DB.
const calendarStore = new Map();
/**
 * Generates a new 30-day content calendar.
 */
const generateCalendar = async (req, res) => {
    const { niche, platform, city, description, brandName } = req.body;
    if (!niche || !platform || !city) {
        return res.status(400).json({ error: "Missing required fields: niche, platform, and city are required." });
    }
    try {
        const calendar = await (0, aiContentService_1.generate30DayCalendar)({ niche, platform, city, description, brandName });
        // Create a unique ID for this calendar
        const calendarId = `cal_${Date.now()}_${(0, uuid_1.v4)().substring(0, 8)}`;
        // Store the generated calendar in our in-memory map
        calendarStore.set(calendarId, calendar);
        return res.status(200).json({
            calendarId,
            calendar,
            message: "30-day content calendar generated successfully."
        });
    }
    catch (error) {
        const err = error;
        console.error("Error in generateCalendar controller:", err);
        return res.status(500).json({ error: "An internal server error occurred while generating the calendar.", details: err.message });
    }
};
exports.generateCalendar = generateCalendar;
/**
 * Retrieves a previously generated calendar by its ID.
 */
const getCalendar = (req, res) => {
    const { calendarId } = req.params;
    if (!calendarId) {
        return res.status(400).json({ error: "Calendar ID is required." });
    }
    const calendar = calendarStore.get(calendarId);
    if (!calendar) {
        return res.status(404).json({ error: "Calendar not found. It may have expired or never existed." });
    }
    return res.status(200).json({
        calendarId,
        calendar
    });
};
exports.getCalendar = getCalendar;
// In-memory store for saved posts (Mock Database)
const savedPostsStore = [];
/**
 * Generates content for a single specific day with context.
 */
const generateDayContent = async (req, res) => {
    const { niche, platform, city, description, brandName, date } = req.body;
    // TODO: Fetch these from the actual database based on the authenticated user/brand
    const mockContext = {
        brandPositioning: "We are a premium, high-tech brand focused on efficiency and style.",
        last7DaysContent: [
            "Tip about productivity",
            "Behind the scenes of our office",
            "Customer testimonial video"
        ],
        recentStats: "Engagement is up 20% on Reels, but static posts are flat."
    };
    if (!niche || !platform || !city || !date) {
        return res.status(400).json({ error: "Missing required fields: niche, platform, city, and date are required." });
    }
    try {
        // Dynamically import to ensure we get the latest version if hot-reloading
        const variations = await Promise.resolve().then(() => __importStar(require("../utils/aiContentService"))).then(m => m.generateDailyPost({
            niche,
            platform,
            city,
            description,
            brandName,
            date,
            context: mockContext
        }));
        return res.status(200).json({
            variations, // Return the object with { viral, reach, niche }
            message: "Content generated successfully for " + date
        });
    }
    catch (error) {
        const err = error;
        console.error("Error in generateDayContent controller:", err);
        return res.status(500).json({ error: "Internal server error.", details: err.message });
    }
};
exports.generateDayContent = generateDayContent;
/**
 * Saves a selected post to the calendar/board.
 */
const savePost = async (req, res) => {
    const { post, date, type } = req.body;
    if (!post || !date) {
        return res.status(400).json({ error: "Post data and date are required." });
    }
    // Add metadata
    const savedPost = {
        ...post,
        id: (0, uuid_1.v4)(),
        savedAt: new Date().toISOString(),
        scheduledDate: date,
        strategyType: type // viral, reach, or niche
    };
    savedPostsStore.push(savedPost);
    return res.status(200).json({
        success: true,
        message: "Post saved to calendar",
        post: savedPost
    });
};
exports.savePost = savePost;
/**
 * Gets all saved posts for the calendar.
 */
const getPosts = async (_req, res) => {
    // In a real app, filter by user/brand ID
    return res.status(200).json({
        posts: savedPostsStore
    });
};
exports.getPosts = getPosts;
/**
 * Updates the status of a specific post (e.g., mark as completed/posted).
 */
const updatePostStatus = async (req, res) => {
    const { postId, status } = req.body;
    if (!postId || !status) {
        return res.status(400).json({ error: "Post ID and status are required." });
    }
    const postIndex = savedPostsStore.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ error: "Post not found." });
    }
    // Update status
    const post = savedPostsStore[postIndex];
    post.status = status;
    // Update store
    savedPostsStore[postIndex] = post;
    return res.status(200).json({
        success: true,
        message: "Post status updated",
        post
    });
};
exports.updatePostStatus = updatePostStatus;
const getCalendarStats = () => {
    const scheduled = savedPostsStore.filter(p => p.status === 'scheduled').length;
    const posted = savedPostsStore.filter(p => p.status === 'posted').length;
    const total = savedPostsStore.length;
    return { scheduled, posted, total };
};
exports.getCalendarStats = getCalendarStats;
const getRecentPosts = () => {
    return savedPostsStore
        .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
        .slice(0, 5);
};
exports.getRecentPosts = getRecentPosts;
//# sourceMappingURL=aiCalendarController.js.map