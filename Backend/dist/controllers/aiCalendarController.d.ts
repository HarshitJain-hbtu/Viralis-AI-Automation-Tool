import { Request, Response } from "express";
/**
 * Generates a new 30-day content calendar.
 */
export declare const generateCalendar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Retrieves a previously generated calendar by its ID.
 */
export declare const getCalendar: (req: Request, res: Response) => Response<any, Record<string, any>>;
/**
 * Generates content for a single specific day with real business context & AI images
 */
export declare const generateDayContent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Regenerates an AI image with a new seed or modified prompt
 */
export declare const regenerateImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Proxies image downloads to bypass CORS restrictions in browser
 */
export declare const downloadImageProxy: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
/**
 * Saves a selected post to the Content Board in MongoDB
 */
export declare const savePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Gets all saved posts for the Content Board from MongoDB
 */
export declare const getPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Updates the status of a specific post (e.g., mark as completed/posted)
 */
export declare const updatePostStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCalendarStats: () => {
    scheduled: number;
    posted: number;
    total: number;
};
export declare const getRecentPosts: () => any[];
//# sourceMappingURL=aiCalendarController.d.ts.map