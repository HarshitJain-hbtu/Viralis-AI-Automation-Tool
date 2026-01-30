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