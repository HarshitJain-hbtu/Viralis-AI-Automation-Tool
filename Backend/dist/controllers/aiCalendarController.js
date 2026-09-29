"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentPosts = exports.getCalendarStats = exports.updatePostStatus = exports.getPosts = exports.savePost = exports.downloadImageProxy = exports.regenerateImage = exports.generateDayContent = exports.getCalendar = exports.generateCalendar = void 0;
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
const Business_1 = require("../models/Business");
const Content_1 = require("../models/Content");
const contentStudioService_1 = require("../services/contentStudioService");
const imageService_1 = require("../services/imageService");
// In-memory fallback store for backward compatibility
const savedPostsStore = [];
/**
 * Generates content for a single specific day with real business context & AI images
 */
const generateDayContent = async (req, res) => {
    const { niche, platform, city, description, brandName, date } = req.body;
    if (!niche || !platform || !date) {
        return res.status(400).json({ error: "Missing required fields: niche, platform, and date are required." });
    }
    try {
        // 1. Fetch the real business profile from MongoDB
        let businessProfile = null;
        const businessId = req.user?.businessId;
        if (businessId) {
            businessProfile = await Business_1.Business.findById(businessId).lean();
        }
        // 2. Build rich, truthful business context
        const businessContext = {
            name: brandName || businessProfile?.name || "Our Business",
            niche: niche || businessProfile?.industryMode || "Service",
            description: description || businessProfile?.description || "",
            location: city || businessProfile?.location?.city || businessProfile?.location?.address || "",
            services: businessProfile?.knowledgeBase?.services || [],
            brandVoiceTone: businessProfile?.brandVoice?.tone || "Professional",
            customContext: description || ""
        };
        console.log(`🚀 [Content Studio] Generating content for ${businessContext.name} (${platform}) on ${date}`);
        // 3. Generate high-quality platform-specific variations + AI images
        const variations = await (0, contentStudioService_1.generateStudioContent)(platform, businessContext, date);
        return res.status(200).json({
            variations,
            message: `Content generated successfully for ${date}`
        });
    }
    catch (error) {
        console.error("Error in generateDayContent controller:", error);
        return res.status(500).json({
            error: "Failed to generate content",
            details: error.message
        });
    }
};
exports.generateDayContent = generateDayContent;
/**
 * Regenerates an AI image with a new seed or modified prompt
 */
const regenerateImage = async (req, res) => {
    try {
        const { prompt, platform, seed, niche, businessName } = req.body;
        const effectivePrompt = (typeof prompt === 'string' && prompt.trim().length > 0)
            ? prompt.trim()
            : `${platform || "Instagram Post"} high-end commercial advertising photography for ${businessName || "modern business"} ${niche ? `in ${niche}` : ""}, studio lighting, professional 8k`;
        const imageUrl = (0, imageService_1.generateImageUrl)({
            prompt: effectivePrompt,
            platform: platform || "Instagram Post",
            seed: seed || Math.floor(Math.random() * 10000000)
        });
        console.log(`🖼️ Regenerated image for ${platform}: ${imageUrl.slice(0, 90)}...`);
        return res.status(200).json({
            success: true,
            imageUrl
        });
    }
    catch (error) {
        console.error("Error regenerating image:", error);
        return res.status(500).json({ error: "Failed to regenerate image", details: error.message });
    }
};
exports.regenerateImage = regenerateImage;
/**
 * Proxies image downloads to bypass CORS restrictions in browser
 */
const downloadImageProxy = async (req, res) => {
    try {
        const imageUrl = req.query.url;
        const filename = req.query.filename || `viralis-visual-${Date.now()}.jpg`;
        if (!imageUrl) {
            return res.status(400).json({ error: "Image URL parameter is required." });
        }
        console.log(`📥 Downloading image via proxy: ${imageUrl.slice(0, 80)}...`);
        const upstreamRes = await fetch(imageUrl);
        if (!upstreamRes.ok) {
            console.warn(`Upstream image returned status ${upstreamRes.status}, redirecting directly`);
            return res.redirect(imageUrl);
        }
        const arrayBuffer = await upstreamRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length.toString());
        return res.end(buffer);
    }
    catch (error) {
        console.error("Error in downloadImageProxy:", error);
        const fallbackUrl = req.query.url;
        if (fallbackUrl) {
            return res.redirect(fallbackUrl);
        }
        return res.status(500).json({ error: "Failed to proxy image download", details: error.message });
    }
};
exports.downloadImageProxy = downloadImageProxy;
/**
 * Saves a selected post to the Content Board in MongoDB
 */
const savePost = async (req, res) => {
    const { post, date, type } = req.body;
    const businessId = req.user?.businessId;
    if (!post || !date) {
        return res.status(400).json({ error: "Post data and date are required." });
    }
    try {
        const platform = (post.platform || "Instagram").toLowerCase();
        const isVideo = platform.includes("reel") || platform.includes("short") || platform.includes("video");
        const contentDoc = await Content_1.Content.create({
            businessId: businessId || undefined,
            title: post.hook || post.title || "Untitled Post",
            body: post.caption || post.voiceoverScript || "",
            type: isVideo ? "video" : "post",
            platform: platform.includes("youtube") ? "youtube" : platform.includes("linkedin") ? "linkedin" : "instagram",
            status: "scheduled",
            scheduledFor: new Date(date),
            aiGenerated: true,
            meta: {
                hook: post.hook,
                hookAlternatives: post.hookAlternatives,
                caption: post.caption,
                hashtags: post.hashtags,
                cta: post.cta,
                bestTime: post.bestTime || post.best_time,
                visualPrompt: post.visualPrompt || post.visual_prompt,
                imageUrl: post.imageUrl,
                storyboard: post.storyboard,
                voiceoverScript: post.voiceoverScript,
                youtubeTitles: post.youtubeTitles,
                youtubeDescription: post.youtubeDescription,
                thumbnailPrompt: post.thumbnailPrompt,
                thumbnailText: post.thumbnailText,
                linkedinTakeaways: post.linkedinTakeaways,
                discussionQuestion: post.discussionQuestion,
                strategyType: type || post.strategyType || "viral",
                scheduledDate: date
            }
        });
        const savedPost = {
            ...post,
            id: contentDoc._id.toString(),
            savedAt: contentDoc.createdAt.toISOString(),
            scheduledDate: date,
            strategyType: type || "viral",
            status: "scheduled"
        };
        savedPostsStore.unshift(savedPost);
        console.log(`✅ [Content Studio] Post saved to MongoDB Content collection: ${contentDoc._id}`);
        return res.status(200).json({
            success: true,
            message: "Post saved to Content Board",
            post: savedPost
        });
    }
    catch (error) {
        console.error("Error in savePost controller:", error);
        return res.status(500).json({ error: "Failed to save post", details: error.message });
    }
};
exports.savePost = savePost;
/**
 * Gets all saved posts for the Content Board from MongoDB
 */
const getPosts = async (req, res) => {
    const businessId = req.user?.businessId;
    try {
        let mongoPosts = [];
        if (businessId) {
            mongoPosts = await Content_1.Content.find({ businessId })
                .sort({ scheduledFor: -1, createdAt: -1 })
                .lean();
        }
        else {
            mongoPosts = await Content_1.Content.find()
                .sort({ scheduledFor: -1, createdAt: -1 })
                .limit(50)
                .lean();
        }
        const formattedPosts = mongoPosts.map(p => ({
            id: p._id.toString(),
            title: p.title || p.meta?.hook || "Untitled Post",
            hook: p.meta?.hook || p.title,
            caption: p.body || p.meta?.caption || "",
            hashtags: p.meta?.hashtags || [],
            visual_prompt: p.meta?.visualPrompt,
            imageUrl: p.meta?.imageUrl,
            best_time: p.meta?.bestTime,
            scheduledDate: p.scheduledFor ? new Date(p.scheduledFor).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            date: p.scheduledFor ? new Date(p.scheduledFor).toISOString() : new Date().toISOString(),
            status: p.status || "scheduled",
            platform: p.platform || "instagram",
            strategyType: p.meta?.strategyType || "viral",
            storyboard: p.meta?.storyboard,
            voiceoverScript: p.meta?.voiceoverScript,
            youtubeTitles: p.meta?.youtubeTitles,
            youtubeDescription: p.meta?.youtubeDescription,
            thumbnailPrompt: p.meta?.thumbnailPrompt,
            thumbnailText: p.meta?.thumbnailText,
            linkedinTakeaways: p.meta?.linkedinTakeaways,
            discussionQuestion: p.meta?.discussionQuestion,
        }));
        return res.status(200).json({
            posts: formattedPosts.length > 0 ? formattedPosts : savedPostsStore
        });
    }
    catch (error) {
        console.error("Error in getPosts controller:", error);
        return res.status(500).json({ error: "Failed to fetch posts", details: error.message });
    }
};
exports.getPosts = getPosts;
/**
 * Updates the status of a specific post (e.g., mark as completed/posted)
 */
const updatePostStatus = async (req, res) => {
    const { postId, status } = req.body;
    const businessId = req.user?.businessId;
    if (!postId || !status) {
        return res.status(400).json({ error: "Post ID and status are required." });
    }
    try {
        if (postId.match(/^[0-9a-fA-F]{24}$/)) {
            const query = { _id: postId };
            if (businessId)
                query.businessId = businessId;
            await Content_1.Content.findOneAndUpdate(query, { status });
        }
        const postIndex = savedPostsStore.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            savedPostsStore[postIndex].status = status;
        }
        return res.status(200).json({
            success: true,
            message: "Post status updated",
            status
        });
    }
    catch (error) {
        console.error("Error updating post status:", error);
        return res.status(500).json({ error: "Failed to update status", details: error.message });
    }
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
    return savedPostsStore.slice(0, 5);
};
exports.getRecentPosts = getRecentPosts;
//# sourceMappingURL=aiCalendarController.js.map