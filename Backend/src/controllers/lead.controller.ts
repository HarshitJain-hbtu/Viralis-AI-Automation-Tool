import { Request, Response } from 'express';
import { Content } from '../models/Content';
import { VideoAnalysis } from '../models/VideoAnalysis';
import { Lead } from '../models/Lead';
import logger from '../utils/logger';
import { fetchPlatformStats, fetchInstagramMediaList, getInstagramBusinessId } from '../utils/platformApi';
import { analyzeVideoWithChatGPT } from '../utils/chatgptAnalysis';

export class LeadController {

    /**
     * Get all video analyses for a business
     */
    static async getVideoAnalyses(req: Request, res: Response) {
        try {
            const { limit = 10, skip = 0 } = req.query;

            const analyses = await VideoAnalysis.find({ businessId: req.user?.businessId })
                .populate('contentId')
                .sort({ analyzedAt: -1 })
                .limit(parseInt(limit as string))
                .skip(parseInt(skip as string));

            const total = await VideoAnalysis.countDocuments({ businessId: req.user?.businessId });

            return res.json({
                data: analyses,
                total,
                limit: parseInt(limit as string),
                skip: parseInt(skip as string)
            });
        } catch (error) {
            logger.error('Error fetching video analyses:', error);
            return res.status(500).json({ error: 'Failed to fetch video analyses' });
        }
    }

    /**
     * Get a single video analysis by ID
     */
    static async getVideoAnalysis(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const analysis = await VideoAnalysis.findById(id)
                .populate('contentId');

            if (!analysis) {
                return res.status(404).json({ error: 'Video analysis not found' });
            }

            // Verify ownership
            if (analysis.businessId.toString() !== req.user?.businessId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            return res.json(analysis);
        } catch (error) {
            logger.error('Error fetching video analysis:', error);
            return res.status(500).json({ error: 'Failed to fetch video analysis' });
        }
    }

    /**
     * Trigger analysis for a specific video
     * POST /leads/analyze - body: { contentId, videoUrl, platform }
     */
    static async analyzeVideo(req: Request, res: Response) {
        try {
            const { contentId, videoUrl, platform } = req.body;

            if (!contentId || !videoUrl || !platform) {
                return res.status(400).json({
                    error: 'Missing required fields: contentId, videoUrl, platform'
                });
            }

            if (!['instagram', 'youtube'].includes(platform)) {
                return res.status(400).json({
                    error: 'Platform must be instagram or youtube'
                });
            }

            // Verify the content belongs to the user's business
            const content = await Content.findById(contentId);
            if (!content || content.businessId.toString() !== req.user?.businessId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Fetch platform stats
            logger.info(`Fetching ${platform} stats for video: ${videoUrl}`);
            const platformStats = await fetchPlatformStats(videoUrl, platform);

            // Analyze with ChatGPT
            logger.info('Sending stats to ChatGPT for analysis');
            const aiAnalysis = await analyzeVideoWithChatGPT(videoUrl, platform, platformStats);

            if (!aiAnalysis) {
                return res.status(500).json({
                    error: 'AI analysis failed. Check if API keys are configured.'
                });
            }

            // Create or update video analysis
            let analysis = await VideoAnalysis.findOne({
                contentId,
                businessId: req.user?.businessId
            });

            if (!analysis) {
                analysis = new VideoAnalysis({
                    businessId: req.user?.businessId,
                    contentId,
                    videoUrl,
                    platform,
                    platformStats: {
                        platform,
                        ...platformStats,
                        fetchedAt: new Date()
                    },
                    aiSummary: aiAnalysis.summary,
                    keyInsights: aiAnalysis.keyInsights,
                    audienceType: aiAnalysis.audienceType,
                    audienceSentiment: aiAnalysis.audienceSentiment,
                    topicsMentioned: aiAnalysis.topicsMentioned,
                    recommendations: aiAnalysis.recommendations,
                    leadQualityScore: aiAnalysis.leadQualityScore,
                    analyzedAt: new Date()
                });
            } else {
                // Update existing analysis
                analysis.platformStats = {
                    platform,
                    ...platformStats,
                    fetchedAt: new Date()
                };
                analysis.aiSummary = aiAnalysis.summary;
                analysis.keyInsights = aiAnalysis.keyInsights;
                analysis.audienceType = aiAnalysis.audienceType;
                analysis.audienceSentiment = aiAnalysis.audienceSentiment;
                analysis.recommendations = aiAnalysis.recommendations;
                analysis.leadQualityScore = aiAnalysis.leadQualityScore;
                analysis.analyzedAt = new Date();
            }

            await analysis.save();

            // Mark content as analyzed
            await Content.findByIdAndUpdate(contentId, {
                platformAnalyzed: true,
                analyzedAt: new Date()
            });

            logger.info(`Video analysis completed for: ${videoUrl}`);

            return res.json({
                message: 'Video analysis completed',
                data: analysis
            });
        } catch (error) {
            logger.error('Error analyzing video:', error);
            return res.status(500).json({
                error: 'Failed to analyze video',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Batch analyze all published videos that haven't been analyzed
     * This would be called by the scheduled task
     */
    static async analyzeAllPublishedVideos(req: Request, res: Response) {
        try {
            const businessId = req.user?.businessId;

            // Find all published videos not yet analyzed
            const unpublishedVideos = await Content.find({
                businessId,
                type: 'video',
                status: 'published',
                platformAnalyzed: false
            });

            logger.info(`Found ${unpublishedVideos.length} videos to analyze`);

            const results = [];

            for (const content of unpublishedVideos) {
                try {
                    if (!content.videoUrl || !content.platform) {
                        logger.warn(`Video missing URL or platform: ${content._id}`);
                        continue;
                    }

                    // Reuse analyzeVideo logic
                    const platformStats = await fetchPlatformStats(
                        content.videoUrl,
                        content.platform as 'instagram' | 'youtube'
                    );

                    const aiAnalysis = await analyzeVideoWithChatGPT(
                        content.videoUrl,
                        content.platform as 'instagram' | 'youtube',
                        platformStats
                    );

                    if (aiAnalysis) {
                        const analysis = new VideoAnalysis({
                            businessId,
                            contentId: content._id,
                            videoUrl: content.videoUrl,
                            platform: content.platform,
                            platformStats: {
                                platform: content.platform,
                                ...platformStats,
                                fetchedAt: new Date()
                            },
                            aiSummary: aiAnalysis.summary,
                            keyInsights: aiAnalysis.keyInsights,
                            audienceType: aiAnalysis.audienceType,
                            audienceSentiment: aiAnalysis.audienceSentiment,
                            topicsMentioned: aiAnalysis.topicsMentioned,
                            recommendations: aiAnalysis.recommendations,
                            leadQualityScore: aiAnalysis.leadQualityScore,
                            analyzedAt: new Date()
                        });

                        await analysis.save();

                        // Mark content as analyzed
                        await Content.findByIdAndUpdate(content._id, {
                            platformAnalyzed: true,
                            analyzedAt: new Date()
                        });

                        results.push({
                            contentId: content._id,
                            status: 'success',
                            analysis
                        });

                        logger.info(`Analyzed video: ${content.videoUrl}`);
                    } else {
                        results.push({
                            contentId: content._id,
                            status: 'failed',
                            error: 'AI analysis failed'
                        });
                    }
                } catch (error) {
                    logger.error(`Error analyzing video ${content._id}:`, error);
                    results.push({
                        contentId: content._id,
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            return res.json({
                message: `Batch analysis completed: ${results.filter(r => r.status === 'success').length}/${results.length} successful`,
                results
            });
        } catch (error) {
            logger.error('Error in batch analysis:', error);
            return res.status(500).json({
                error: 'Batch analysis failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get insights for competitor comparison
     */
    static async getCompetitorComparison(req: Request, res: Response) {
        try {
            const { videoId } = req.query;

            const analysis = await VideoAnalysis.findById(videoId);

            if (!analysis) {
                return res.status(404).json({ error: 'Analysis not found' });
            }

            // Verify ownership
            if (analysis.businessId.toString() !== req.user?.businessId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Return structured data for competitor analysis
            return res.json({
                videoAnalysis: {
                    platform: analysis.platform,
                    stats: analysis.platformStats,
                    engagement: analysis.platformStats.engagement,
                    reach: analysis.platformStats.reach,
                    audienceType: analysis.audienceType,
                    leadQualityScore: analysis.leadQualityScore
                },
                insights: {
                    summary: analysis.aiSummary,
                    keyInsights: analysis.keyInsights,
                    sentiment: analysis.audienceSentiment,
                    recommendations: analysis.recommendations
                }
            });
        } catch (error) {
            logger.error('Error getting competitor comparison:', error);
            return res.status(500).json({ error: 'Failed to get comparison data' });
        }
    }

    /**
     * Get all leads for a business
     * GET /api/leads
     */
    static async getLeads(req: Request, res: Response) {
        try {
            const { limit = 20, skip = 0, status, source } = req.query;
            const businessId = req.user?.businessId;

            const query: any = { businessId };
            if (status) query.status = status;
            if (source) query.source = source;

            const leads = await Lead.find(query)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit as string))
                .skip(parseInt(skip as string));

            const total = await Lead.countDocuments(query);

            return res.json({
                data: leads,
                total,
                limit: parseInt(limit as string),
                skip: parseInt(skip as string)
            });
        } catch (error) {
            logger.error('Error fetching leads:', error);
            return res.status(500).json({ error: 'Failed to fetch leads' });
        }
    }

    /**
     * Get single lead by ID
     * GET /api/leads/:id
     */
    static async getLeadById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const lead = await Lead.findOne({ _id: id, businessId: req.user?.businessId });

            if (!lead) {
                return res.status(404).json({ error: 'Lead not found' });
            }

            return res.json(lead);
        } catch (error) {
            logger.error('Error fetching lead:', error);
            return res.status(500).json({ error: 'Failed to fetch lead' });
        }
    }

    /**
     * Create a new lead
     * POST /api/leads
     */
    static async createLead(req: Request, res: Response) {
        try {
            const { name, email, phone, status, source, notes } = req.body;
            const businessId = req.user?.businessId;

            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const lead = new Lead({
                businessId,
                name,
                email,
                phone,
                status: status || 'new',
                source: source || 'Manual',
                notes
            });

            await lead.save();

            return res.status(201).json(lead);
        } catch (error) {
            logger.error('Error creating lead:', error);
            return res.status(500).json({ error: 'Failed to create lead' });
        }
    }

    /**
     * Update a lead
     * PATCH /api/leads/:id
     */
    static async updateLead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const businessId = req.user?.businessId;

            const lead = await Lead.findOneAndUpdate(
                { _id: id, businessId },
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!lead) {
                return res.status(404).json({ error: 'Lead not found' });
            }

            return res.json(lead);
        } catch (error) {
            logger.error('Error updating lead:', error);
            return res.status(500).json({ error: 'Failed to update lead' });
        }
    }

    /**
     * Delete a lead
     * DELETE /api/leads/:id
     */
    static async deleteLead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const businessId = req.user?.businessId;

            const lead = await Lead.findOneAndDelete({ _id: id, businessId });

            if (!lead) {
                return res.status(404).json({ error: 'Lead not found' });
            }

            return res.json({ message: 'Lead deleted successfully' });
        } catch (error) {
            logger.error('Error deleting lead:', error);
            return res.status(500).json({ error: 'Failed to delete lead' });
        }
    }

    /**
     * Fetch recent Instagram media for the connected account
     * GET /leads/instagram-media
     */
    static async getInstagramMedia(req: Request, res: Response) {
        try {
            const { limit = 24 } = req.query;
            const igAccountId = await LeadController.getOrDiscoverInstagramAccountId(req);

            if (!igAccountId) {
                return res.status(404).json({
                    error: 'No Instagram Business Account linked to this token.'
                });
            }

            const media = await fetchInstagramMediaList(igAccountId, parseInt(limit as string));
            return res.json({
                data: media,
                accountId: igAccountId
            });
        } catch (error) {
            logger.error('Error in getInstagramMedia:', error);
            return res.status(500).json({ error: 'Failed to fetch Instagram media' });
        }
    }

    /**
     * POST /leads/sync-instagram - Sync a specific media item to the Content table
     */
    static async syncInstagramMedia(req: Request, res: Response) {
        try {
            const { id, caption, media_url, media_type } = req.body;

            if (!id || !media_url) {
                return res.status(400).json({ error: 'Missing media ID or URL' });
            }

            // Find or create Content record
            let content = await Content.findOne({
                platformPostId: id,
                businessId: req.user?.businessId
            });

            if (!content) {
                content = new Content({
                    businessId: req.user?.businessId,
                    title: caption?.substring(0, 50) || `Instagram Post ${id}`,
                    body: caption || '',
                    type: 'video', // We assume it's for analysis, usually videos
                    platform: 'instagram',
                    status: 'published',
                    videoUrl: media_url,
                    platformPostId: id,
                    meta: { media_type }
                });
                await content.save();
            }

            return res.json({
                message: 'Media synced successfully',
                data: content
            });
        } catch (error) {
            logger.error('Error syncing Instagram media:', error);
            return res.status(500).json({ error: 'Failed to sync media' });
        }
    }

    /**
     * Internal helper to find IG account ID
     */
    private static async getOrDiscoverInstagramAccountId(_req: Request): Promise<string | null> {
        // We use the automatic discovery logic I built in platformApi.
        return await getInstagramBusinessId();
    }
}
