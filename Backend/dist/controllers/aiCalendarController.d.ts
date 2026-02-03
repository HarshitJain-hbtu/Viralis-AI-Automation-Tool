import { Request, Response } from "express";
import { DayPost } from "../utils/aiContentService";
/**
 * Generates a new 30-day content calendar.
 */
export declare const generateCalendar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Retrieves a previously generated calendar by its ID.
 */
export declare const getCalendar: (req: Request, res: Response) => Response<any, Record<string, any>>;
/**
 * Generates content for a single specific day with context.
 */
export declare const generateDayContent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Saves a selected post to the calendar/board.
 */
export declare const savePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Gets all saved posts for the calendar.
 */
export declare const getPosts: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Updates the status of a specific post (e.g., mark as completed/posted).
 */
export declare const updatePostStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCalendarStats: () => {
    scheduled: number;
    posted: number;
    total: number;
};
export declare const getRecentPosts: () => DayPost[];
//# sourceMappingURL=aiCalendarController.d.ts.map