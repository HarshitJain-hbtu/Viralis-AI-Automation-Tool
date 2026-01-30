import { Router } from "express";
import { generateCalendar, getCalendar } from "../controllers/aiCalendarController";

const router = Router();

// POST /api/ai-content/calendar
// Generates a new 30-day content calendar
// This is a public route
router.post("/calendar", generateCalendar);

// GET /api/ai-content/calendar/:calendarId
// Retrieves a generated calendar by its ID
// This is a public route
router.get("/calendar/:calendarId", getCalendar);

export default router;