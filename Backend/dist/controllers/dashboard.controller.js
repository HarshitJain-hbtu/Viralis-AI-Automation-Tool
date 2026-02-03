"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const Lead_1 = require("../models/Lead");
const Transcript_1 = require("../models/Transcript");
const aiCalendarController_1 = require("./aiCalendarController");
const User_1 = require("../models/User");
const googleapis_1 = require("googleapis");
class DashboardController {
    static async getStats(req, res) {
        try {
            const businessId = req.user?.businessId;
            const userId = req.user.userId || req.user.id;
            console.log('DEBUG: Dashboard req.user:', req.user);
            console.log('DEBUG: Resolved userId:', userId);
            // Fetch User first (needed for queries)
            const user = await User_1.User.findById(userId);
            // 1. Content Stats (from in-memory store for now)
            const contentStats = (0, aiCalendarController_1.getCalendarStats)();
            // 2. Lead Stats (from DB)
            const totalLeads = await Lead_1.Lead.countDocuments({ businessId });
            const newLeads = await Lead_1.Lead.countDocuments({ businessId, status: 'new' });
            const qualifiedLeads = await Lead_1.Lead.countDocuments({ businessId, status: 'qualified' });
            const calls = await Lead_1.Lead.countDocuments({ businessId, status: 'contacted' });
            // Note: 'calls' in UI map to 'contacted' or similar, but let's use Transcript for real calls if available.
            // 3. Voice Stats (from Transcripts)
            const totalCalls = await Transcript_1.Transcript.countDocuments({ businessId });
            // Calculate Avg Duration & Sentiment
            const transcriptAgg = await Transcript_1.Transcript.aggregate([
                { $match: { businessId: user?._id || businessId } }, // Use correct ID
                {
                    $group: {
                        _id: null,
                        avgDuration: { $avg: "$durationSeconds" },
                        positiveCount: {
                            $sum: { $cond: [{ $eq: ["$sentiment", "positive"] }, 1, 0] }
                        },
                        negativeCount: {
                            $sum: { $cond: [{ $eq: ["$sentiment", "negative"] }, 1, 0] }
                        }
                    }
                }
            ]);
            const avgDurationSeconds = transcriptAgg[0]?.avgDuration || 0;
            const avgDurationText = `${Math.floor(avgDurationSeconds / 60)}m ${Math.round(avgDurationSeconds % 60)}s`;
            // Determine dominant sentiment
            let sentiment = 'Neutral';
            if (transcriptAgg.length > 0) {
                if (transcriptAgg[0].positiveCount > transcriptAgg[0].negativeCount)
                    sentiment = 'Positive';
                else if (transcriptAgg[0].negativeCount > transcriptAgg[0].positiveCount)
                    sentiment = 'Negative';
            }
            // 4. Social Growth Data (Simulated History based on Real Totals)
            // const user = await User.findById(userId); // Moved to top
            let youtubeStats = user?.socialAccounts?.youtube?.stats;
            const instagramStats = user?.socialAccounts?.instagram?.stats;
            // Auto-heal: If YouTube connected but no stats, fetch them now
            if (user?.socialAccounts?.youtube?.accessToken && !youtubeStats?.viewCount) {
                try {
                    const oauth2Client = new googleapis_1.google.auth.OAuth2();
                    oauth2Client.setCredentials({ access_token: user.socialAccounts.youtube.accessToken });
                    const youtube = googleapis_1.google.youtube({ version: 'v3', auth: oauth2Client });
                    const channelResponse = await youtube.channels.list({
                        part: ['statistics', 'snippet'],
                        mine: true
                    });
                    if (channelResponse.data.items && channelResponse.data.items.length > 0) {
                        const channel = channelResponse.data.items[0];
                        youtubeStats = {
                            viewCount: channel.statistics?.viewCount || '0',
                            subscriberCount: channel.statistics?.subscriberCount || '0',
                            videoCount: channel.statistics?.videoCount || '0',
                            channelTitle: channel.snippet?.title,
                            avatarUrl: channel.snippet?.thumbnails?.default?.url
                        };
                        // Save to DB to avoid re-fetching
                        if (user.socialAccounts.youtube) {
                            user.socialAccounts.youtube.stats = youtubeStats;
                            await user.save();
                        }
                    }
                }
                catch (err) {
                    console.error("Error auto-healing YouTube stats:", err);
                }
            }
            const ytCurrent = parseInt(youtubeStats?.viewCount || '0') || 0;
            const igCurrent = (instagramStats?.followers_count || 0) + (instagramStats?.media_count * 100 || 0);
            // Generate 6-month curve
            const growthData = Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (5 - i)); // Go back 5 months
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                // Simulate organic growth curve (Monthly accumulation)
                // i=0 (5 months ago) -> factor ~0.5
                // i=5 (Current) -> factor = 1.0
                const factor = 0.5 + (i * 0.1);
                return {
                    name: monthName,
                    youtube: Math.max(0, Math.floor(Number(ytCurrent || 0) * factor)),
                    instagram: Math.max(0, Math.floor(Number(igCurrent || 0) * factor))
                };
            });
            // 5. Recent Activity
            const recentLeads = await Lead_1.Lead.find({ businessId }).sort({ createdAt: -1 }).limit(5);
            const recentTranscripts = await Transcript_1.Transcript.find({ businessId }).sort({ createdAt: -1 }).limit(5);
            const recentPosts = (0, aiCalendarController_1.getRecentPosts)();
            const events = [
                ...recentLeads.map(l => ({ type: 'lead', data: l, date: l.createdAt })),
                ...recentTranscripts.map(t => ({ type: 'call', data: t, date: t.createdAt })),
                ...recentPosts.map((p) => ({ type: 'content', data: p, date: p.savedAt }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 7);
            return res.json({
                content: {
                    scheduled: contentStats.scheduled,
                    posted: contentStats.posted,
                    total: contentStats.total
                },
                leads: {
                    total: totalLeads,
                    pipeline: [
                        { label: "New", value: newLeads, color: "bg-blue-500" },
                        { label: "Qualified", value: qualifiedLeads, color: "bg-green-500" },
                        { label: "Calls", value: calls, color: "bg-orange-500" }
                    ]
                },
                voice: {
                    callsHandled: totalCalls || 0,
                    avgDuration: avgDurationText,
                    sentiment: sentiment,
                    active: true
                },
                recentEvents: events,
                growthData
            });
        }
        catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map