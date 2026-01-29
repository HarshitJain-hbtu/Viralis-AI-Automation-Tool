import { Router } from "express";
import { generateCalendar, getCalendar } from "../controllers/aiCalendarController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// POST /api/ai-content/calendar
// Generates a new 30-day content calendar
// Protected route, user must be logged in
router.post("/calendar", authMiddleware, generateCalendar);

// GET /api/ai-content/calendar/:calendarId
// Retrieves a generated calendar by its ID
// Also protected
router.get("/calendar/:calendarId", authMiddleware, getCalendar);

export default router;