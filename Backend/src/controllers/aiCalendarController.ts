import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generate30DayCalendar, DayPost, CalendarInput } from "../utils/aiContentService";

// In-memory store for this prototype. In production, use a database like Redis or a persistent DB.
const calendarStore = new Map<string, DayPost[]>();

/**
 * Generates a new 30-day content calendar.
 */
export const generateCalendar = async (req: Request, res: Response) => {
  const { niche, platform, city, description, brandName } = req.body as CalendarInput;

  if (!niche || !platform || !city) {
    return res.status(400).json({ error: "Missing required fields: niche, platform, and city are required." });
  }

  try {
    const calendar = await generate30DayCalendar({ niche, platform, city, description, brandName });

    // Create a unique ID for this calendar
    const calendarId = `cal_${Date.now()}_${uuidv4().substring(0, 8)}`;

    // Store the generated calendar in our in-memory map
    calendarStore.set(calendarId, calendar);

    return res.status(200).json({
      calendarId,
      calendar,
      message: "30-day content calendar generated successfully."
    });

  } catch (error) {
    const err = error as Error;
    console.error("Error in generateCalendar controller:", err);
    return res.status(500).json({ error: "An internal server error occurred while generating the calendar.", details: err.message });
  }
};

/**
 * Retrieves a previously generated calendar by its ID.
 */
export const getCalendar = (req: Request, res: Response) => {
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

import { Business } from "../models/Business";
import { Content } from "../models/Content";
import { generateStudioContent, SupportedPlatform, BusinessContext } from "../services/contentStudioService";
import { generateImageUrl } from "../services/imageService";

// In-memory fallback store for backward compatibility
const savedPostsStore: any[] = [];

/**
 * Generates content for a single specific day with real business context & AI images
 */
export const generateDayContent = async (req: Request, res: Response) => {
  const { niche, platform, city, description, brandName, date } = req.body;

  if (!niche || !platform || !date) {
    return res.status(400).json({ error: "Missing required fields: niche, platform, and date are required." });
  }

  try {
    // 1. Fetch the real business profile from MongoDB
    let businessProfile: any = null;
    const businessId = (req as any).user?.businessId;

    if (businessId) {
      businessProfile = await Business.findById(businessId).lean();
    }

    // 2. Build rich, truthful business context
    const businessContext: BusinessContext = {
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
    const variations = await generateStudioContent(
      platform as SupportedPlatform,
      businessContext,
      date
    );

    return res.status(200).json({
      variations,
      message: `Content generated successfully for ${date}`
    });

  } catch (error: any) {
    console.error("Error in generateDayContent controller:", error);
    return res.status(500).json({
      error: "Failed to generate content",
      details: error.message
    });
  }
};

/**
 * Regenerates an AI image with a new seed or modified prompt
 */
export const regenerateImage = async (req: Request, res: Response) => {
  try {
    const { prompt, platform, seed } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    const imageUrl = generateImageUrl({
      prompt,
      platform: platform || "Instagram Post",
      seed: seed || Math.floor(Math.random() * 1000000)
    });

    return res.status(200).json({
      success: true,
      imageUrl
    });
  } catch (error: any) {
    console.error("Error regenerating image:", error);
    return res.status(500).json({ error: "Failed to regenerate image", details: error.message });
  }
};

/**
 * Saves a selected post to the Content Board in MongoDB
 */
export const savePost = async (req: Request, res: Response) => {
  const { post, date, type } = req.body;
  const businessId = (req as any).user?.businessId;

  if (!post || !date) {
    return res.status(400).json({ error: "Post data and date are required." });
  }

  try {
    const platform = (post.platform || "Instagram").toLowerCase();
    const isVideo = platform.includes("reel") || platform.includes("short") || platform.includes("video");

    const contentDoc = await Content.create({
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

  } catch (error: any) {
    console.error("Error in savePost controller:", error);
    return res.status(500).json({ error: "Failed to save post", details: error.message });
  }
};

/**
 * Gets all saved posts for the Content Board from MongoDB
 */
export const getPosts = async (req: Request, res: Response) => {
  const businessId = (req as any).user?.businessId;

  try {
    let mongoPosts: any[] = [];
    if (businessId) {
      mongoPosts = await Content.find({ businessId })
        .sort({ scheduledFor: -1, createdAt: -1 })
        .lean();
    } else {
      mongoPosts = await Content.find()
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

  } catch (error: any) {
    console.error("Error in getPosts controller:", error);
    return res.status(500).json({ error: "Failed to fetch posts", details: error.message });
  }
};

/**
 * Updates the status of a specific post (e.g., mark as completed/posted)
 */
export const updatePostStatus = async (req: Request, res: Response) => {
  const { postId, status } = req.body;
  const businessId = (req as any).user?.businessId;

  if (!postId || !status) {
    return res.status(400).json({ error: "Post ID and status are required." });
  }

  try {
    if (postId.match(/^[0-9a-fA-F]{24}$/)) {
      const query: any = { _id: postId };
      if (businessId) query.businessId = businessId;

      await Content.findOneAndUpdate(query, { status });
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

  } catch (error: any) {
    console.error("Error updating post status:", error);
    return res.status(500).json({ error: "Failed to update status", details: error.message });
  }
};

export const getCalendarStats = () => {
  const scheduled = savedPostsStore.filter(p => p.status === 'scheduled').length;
  const posted = savedPostsStore.filter(p => p.status === 'posted').length;
  const total = savedPostsStore.length;
  return { scheduled, posted, total };
};

export const getRecentPosts = () => {
  return savedPostsStore.slice(0, 5);
};
