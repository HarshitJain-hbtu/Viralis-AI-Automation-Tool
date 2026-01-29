import { Request, Response } from "express";
import { generate30DayCalendar } from "../utils/aiContentService";

// Store calendars in memory (use Redis/DB in production)
const calendarStore = new Map<string, any[]>();

// Generate 30-day TEXT plan (no images)
export async function generateCalendar(req: Request, res: Response) {
  try {
    const { niche, platform, city, description, brandName, brandLogo } = req.body;

    if (!niche || !platform || !city) {
      return res.status(400).json({ error: "Missing required fields: niche, platform, city" });
    }

    const calendar = await generate30DayCalendar({
      niche,
      platform,
      city,
      description,
      brandName,
      brandLogo,
    });

    // Generate unique ID for this calendar
    const calendarId = `cal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store calendar for later image generation
    calendarStore.set(calendarId, calendar);

    res.json({
      calendarId,
      calendar,
      message: "30-day calendar generated. Click 'Generate Image' on any day to create the visual."
    });
  } catch (error) {
    console.error("Calendar generation error:", error);
    res.status(500).json({ error: "Failed to generate calendar" });
  }
}

// Generate image for a SINGLE day (on-demand)
export async function generateDayImage(req: Request, res: Response) {
  try {
    const { calendarId, day } = req.params;
    
    const calendar = calendarStore.get(calendarId);
    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found. Generate a new one." });
    }

    const dayData = calendar.find((d: any) => d.day === parseInt(day));
    if (!dayData) {
      return res.status(404).json({ error: `Day ${day} not found in calendar` });
    }

    // Call n8n webhook to generate image
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visual_prompt: dayData.visual_prompt,
        day: dayData.day,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error("n8n image generation failed");
    }

    const imageData = await n8nResponse.json();

    // Update calendar with generated image
    dayData.image_url = imageData.image_url;
    dayData.image_generated = true;

    res.json({
      day: dayData.day,
      image_url: imageData.image_url,
      visual_prompt: dayData.visual_prompt,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Failed to generate image. Try again in a few seconds." });
  }
}

// Get calendar by ID
export async function getCalendar(req: Request, res: Response) {
  const { calendarId } = req.params;
  const calendar = calendarStore.get(calendarId);
  
  if (!calendar) {
    return res.status(404).json({ error: "Calendar not found" });
  }
  
  res.json({ calendarId, calendar });
}
