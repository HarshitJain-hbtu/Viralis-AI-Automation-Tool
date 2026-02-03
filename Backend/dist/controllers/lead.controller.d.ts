import { Request, Response } from 'express';
export declare class LeadController {
    /**
     * Get all video analyses for a business
     */
    static getVideoAnalyses(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get a single video analysis by ID
     */
    static getVideoAnalysis(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Trigger analysis for a specific video
     * POST /leads/analyze - body: { contentId, videoUrl, platform }
     */
    static analyzeVideo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Batch analyze all published videos that haven't been analyzed
     * This would be called by the scheduled task
     */
    static analyzeAllPublishedVideos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get insights for competitor comparison
     */
    static getCompetitorComparison(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all leads for a business
     * GET /api/leads
     */
    static getLeads(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get single lead by ID
     * GET /api/leads/:id
     */
    static getLeadById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new lead
     * POST /api/leads
     */
    static createLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update a lead
     * PATCH /api/leads/:id
     */
    static updateLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a lead
     * DELETE /api/leads/:id
     */
    static deleteLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch recent Instagram media for the connected account
     * GET /leads/instagram-media
     */
    static getInstagramMedia(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /leads/sync-instagram - Sync a specific media item to the Content table
     */
    static syncInstagramMedia(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Internal helper to find IG account ID
     */
    private static getOrDiscoverInstagramAccountId;
}
//# sourceMappingURL=lead.controller.d.ts.map