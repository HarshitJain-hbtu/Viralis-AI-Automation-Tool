import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

// Helper to verify JWT from state
const verifyUserFromState = (state: string): string | null => {
    try {
        const decoded: any = jwt.verify(state, process.env.JWT_SECRET as string);
        return decoded.userId || decoded.id; // Adjust based on your JWT payload structure
    } catch (err) {
        return null;
    }
};

export const youtubeCallback = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { state } = req.query;
        // The user object is attached by passport
        const userPayload = req.user as any;

        if (!userPayload || !state) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=auth_failed`);
        }

        const userId = verifyUserFromState(state as string);
        if (!userId) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=invalid_session`);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
        }

        // Initialize socialAccounts if needed
        if (!user.socialAccounts) user.socialAccounts = {};

        user.socialAccounts.youtube = {
            accessToken: userPayload.accessToken,
            refreshToken: userPayload.refreshToken,
            channelId: userPayload.profile.id, // Assuming channel ID is the profile ID for now
            stats: {} // Will be populated later
        };

        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?social_connected=youtube`);
    } catch (error) {
        console.error('YouTube Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=server_error`);
    }
};

export const facebookCallback = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { state } = req.query;
        const userPayload = req.user as any;

        if (!userPayload || !state) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=auth_failed`);
        }

        const userId = verifyUserFromState(state as string);
        if (!userId) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=invalid_session`);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
        }

        if (!user.socialAccounts) user.socialAccounts = {};

        user.socialAccounts.facebook = {
            accessToken: userPayload.accessToken,
            userId: userPayload.profile.id,
            stats: {}
        };

        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?social_connected=facebook`);
    } catch (error) {
        console.error('Facebook Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=server_error`);
    }
};

export const mockFacebookAuth = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.socialAccounts) user.socialAccounts = {};

        user.socialAccounts.facebook = {
            accessToken: 'mock_access_token_' + Date.now(),
            userId: 'mock_fb_user_id',
            stats: {
                followers_count: 12500,
                rating_count: 48,
                engagement: 'High'
            }
        };

        await user.save();

        return res.json({ message: 'Facebook connected (Mock Mode)', stats: user.socialAccounts.facebook.stats });
    } catch (error) {
        console.error('Mock Auth Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

import { google } from 'googleapis';

export const getSocialStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Live Fetch for YouTube
        if (user.socialAccounts?.youtube?.accessToken) {
            try {
                const oauth2Client = new google.auth.OAuth2();
                oauth2Client.setCredentials({ access_token: user.socialAccounts.youtube.accessToken });

                const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

                // 1. Get Channel Stats & Uploads Playlist ID
                const channelResponse = await youtube.channels.list({
                    part: ['statistics', 'snippet', 'contentDetails'],
                    mine: true
                });

                if (channelResponse.data.items && channelResponse.data.items.length > 0) {
                    const channel = channelResponse.data.items[0];
                    const stats = channel.statistics;
                    // Safely access uploads playlist
                    const uploadsPlaylistId = (channel.contentDetails as any)?.relatedPlaylists?.uploads;

                    // 2. Get Recent Videos from Uploads Playlist
                    let recentVideos: any[] = [];
                    if (uploadsPlaylistId) {
                        try {
                            const playlistResponse = await youtube.playlistItems.list({
                                playlistId: uploadsPlaylistId,
                                part: ['snippet', 'contentDetails'],
                                maxResults: 5
                            });

                            const videoIds = playlistResponse?.data?.items?.map(item => item.contentDetails?.videoId).filter(id => id) as string[];

                            // 3. Get Stats for these videos
                            if (videoIds && videoIds.length > 0) {
                                const videosResponse = await youtube.videos.list({
                                    id: videoIds,
                                    part: ['statistics', 'snippet']
                                });

                                recentVideos = videosResponse?.data?.items?.map(video => ({
                                    id: video.id,
                                    title: video.snippet?.title,
                                    thumbnail: video.snippet?.thumbnails?.medium?.url,
                                    publishedAt: video.snippet?.publishedAt,
                                    viewCount: video.statistics?.viewCount,
                                    likeCount: video.statistics?.likeCount,
                                    commentCount: video.statistics?.commentCount
                                })) || [];
                            }
                        } catch (vidErr) {
                            console.error('Error fetching recent videos', vidErr);
                        }
                    }

                    // 4. Get Recent Comments (The "Inbox")
                    let recentComments: any[] = [];
                    try {
                        const commentsResponse = await youtube.commentThreads.list({
                            part: ['snippet', 'replies'],
                            allThreadsRelatedToChannelId: channel.id || undefined,
                            maxResults: 5
                        });

                        recentComments = commentsResponse.data.items?.map((thread: any) => {
                            const topLevel = thread.snippet?.topLevelComment?.snippet;
                            const replies = thread.replies?.comments?.map((reply: any) => ({
                                id: reply.id,
                                authorDisplayName: reply.snippet?.authorDisplayName,
                                authorProfileImageUrl: reply.snippet?.authorProfileImageUrl,
                                textDisplay: reply.snippet?.textDisplay,
                                publishedAt: reply.snippet?.publishedAt,
                                likeCount: reply.snippet?.likeCount
                            })) || [];

                            return {
                                id: thread.id,
                                authorDisplayName: topLevel?.authorDisplayName,
                                authorProfileImageUrl: topLevel?.authorProfileImageUrl,
                                textDisplay: topLevel?.textDisplay,
                                publishedAt: topLevel?.publishedAt,
                                videoId: topLevel?.videoId, // To link back to video
                                likeCount: topLevel?.likeCount,
                                totalReplyCount: thread.snippet?.totalReplyCount,
                                replies: replies
                            };
                        }) || [];
                    } catch (commentErr) {
                        console.error('Error fetching comments', commentErr);
                    }

                    // Update DB with fresh stats
                    user.socialAccounts.youtube.stats = {
                        subscriberCount: stats?.subscriberCount,
                        viewCount: stats?.viewCount,
                        videoCount: stats?.videoCount,
                        channelTitle: channel.snippet?.title,
                        avatarUrl: channel.snippet?.thumbnails?.default?.url,
                        recentVideos: recentVideos,
                        recentComments: recentComments
                    };
                    await user.markModified('socialAccounts'); // Tell Mongoose mixed type changed
                    await user.save();
                }
            } catch (ytError: any) {
                console.error('Failed to fetch YouTube stats:', ytError.message);
                // Continue, return stale stats if any
                // If token expired, we should handle refresh here.
            }
        }

        return res.json({
            youtube: user.socialAccounts?.youtube?.stats || null,
            facebook: user.socialAccounts?.facebook?.stats || null
        });

    } catch (error) {
        console.error('Get Stats Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const postYouTubeReply = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { commentId, text } = req.body;

        if (!commentId || !text) {
            return res.status(400).json({ error: 'Missing commentId or text' });
        }

        const user = await User.findById(userId);
        if (!user || !user.socialAccounts?.youtube?.accessToken) {
            return res.status(401).json({ error: 'YouTube account not connected' });
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: user.socialAccounts.youtube.accessToken });

        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

        const response = await youtube.comments.insert({
            part: ['snippet'],
            requestBody: {
                snippet: {
                    parentId: commentId,
                    textOriginal: text
                }
            }
        });

        // structure the response to match our frontend expectation
        const newComment = {
            id: response.data.id,
            authorDisplayName: response.data.snippet?.authorDisplayName,
            authorProfileImageUrl: response.data.snippet?.authorProfileImageUrl,
            textDisplay: response.data.snippet?.textDisplay,
            publishedAt: response.data.snippet?.publishedAt,
            likeCount: response.data.snippet?.likeCount || 0
        };

        return res.json({ success: true, comment: newComment });

    } catch (error: any) {
        console.error('Post YouTube Reply Error:', error.message);
        return res.status(500).json({ error: 'Failed to post reply to YouTube', details: error.message });
    }
};
