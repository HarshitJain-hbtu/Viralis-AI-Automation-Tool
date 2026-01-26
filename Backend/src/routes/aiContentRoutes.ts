import { Router } from "express";
import { generateCalendar, generateDayImage, getCalendar } from "../controllers/aiCalendarController";

const router = Router();

// Generate 30-day text calendar
router.post("/calendar", generateCalendar);

// Get existing calendar
router.get("/calendar/:calendarId", getCalendar);

// Generate image for specific day (on-demand)
router.post("/calendar/:calendarId/day/:day/image", generateDayImage);

export default router;
