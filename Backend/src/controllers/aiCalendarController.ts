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

// In-memory store for saved posts (Mock Database)
const savedPostsStore: DayPost[] = [];

/**
 * Generates content for a single specific day with context.
 */
export const generateDayContent = async (req: Request, res: Response) => {
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
    const variations = await import("../utils/aiContentService").then(m => m.generateDailyPost({
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

  } catch (error) {
    const err = error as Error;
    console.error("Error in generateDayContent controller:", err);
    return res.status(500).json({ error: "Internal server error.", details: err.message });
  }
};

/**
 * Saves a selected post to the calendar/board.
 */
export const savePost = async (req: Request, res: Response) => {
  const { post, date, type } = req.body;

  if (!post || !date) {
    return res.status(400).json({ error: "Post data and date are required." });
  }

  // Add metadata
  const savedPost = {
    ...post,
    id: uuidv4(),
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

/**
 * Gets all saved posts for the calendar.
 */
export const getPosts = async (_req: Request, res: Response) => {
  // In a real app, filter by user/brand ID
  return res.status(200).json({
    posts: savedPostsStore
  });
};

/**
 * Updates the status of a specific post (e.g., mark as completed/posted).
 */
export const updatePostStatus = async (req: Request, res: Response) => {
  const { postId, status } = req.body;

  if (!postId || !status) {
    return res.status(400).json({ error: "Post ID and status are required." });
  }

  const postIndex = savedPostsStore.findIndex(p => (p as any).id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found." });
  }

  // Update status
  const post = savedPostsStore[postIndex];
  (post as any).status = status;

  // Update store
  savedPostsStore[postIndex] = post;

  return res.status(200).json({
    success: true,
    message: "Post status updated",
    post
  });

};

export const getCalendarStats = () => {
  const scheduled = savedPostsStore.filter(p => (p as any).status === 'scheduled').length;
  const posted = savedPostsStore.filter(p => (p as any).status === 'posted').length;
  const total = savedPostsStore.length;
  return { scheduled, posted, total };
};

export const getRecentPosts = () => {
  return savedPostsStore
    .sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .slice(0, 5);
};
