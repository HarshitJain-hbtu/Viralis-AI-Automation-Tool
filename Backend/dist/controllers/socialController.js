"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postYouTubeReply = exports.getSocialStats = exports.mockFacebookAuth = exports.facebookCallback = exports.youtubeCallback = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Helper to verify JWT from state
const verifyUserFromState = (state) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(state, process.env.JWT_SECRET);
        return decoded.userId || decoded.id; // Adjust based on your JWT payload structure
    }
    catch (err) {
        return null;
    }
};
const youtubeCallback = async (req, res, _next) => {
    try {
        const { state } = req.query;
        // The user object is attached by passport
        const userPayload = req.user;
        if (!userPayload || !state) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=auth_failed`);
        }
        const userId = verifyUserFromState(state);
        if (!userId) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=invalid_session`);
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
        }
        // Initialize socialAccounts if needed
        if (!user.socialAccounts)
            user.socialAccounts = {};
        user.socialAccounts.youtube = {
            accessToken: userPayload.accessToken,
            refreshToken: userPayload.refreshToken,
            channelId: userPayload.profile.id, // Assuming channel ID is the profile ID for now
            stats: {} // Will be populated later
        };
        await user.save();
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?social_connected=youtube`);
    }
    catch (error) {
        console.error('YouTube Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=server_error`);
    }
};
exports.youtubeCallback = youtubeCallback;
const facebookCallback = async (req, res, _next) => {
    try {
        const { state } = req.query;
        const userPayload = req.user;
        if (!userPayload || !state) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=auth_failed`);
        }
        const userId = verifyUserFromState(state);
        if (!userId) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=invalid_session`);
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
        }
        if (!user.socialAccounts)
            user.socialAccounts = {};
        user.socialAccounts.facebook = {
            accessToken: userPayload.accessToken,
            userId: userPayload.profile.id,
            stats: {}
        };
        await user.save();
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?social_connected=facebook`);
    }
    catch (error) {
        console.error('Facebook Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=server_error`);
    }
};
exports.facebookCallback = facebookCallback;
const mockFacebookAuth = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!user.socialAccounts)
            user.socialAccounts = {};
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
    }
    catch (error) {
        console.error('Mock Auth Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.mockFacebookAuth = mockFacebookAuth;
const axios_1 = __importDefault(require("axios"));
const googleapis_1 = require("googleapis");
const getSocialStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Live Fetch for YouTube
        if (user.socialAccounts?.youtube?.accessToken) {
            try {
                const oauth2Client = new googleapis_1.google.auth.OAuth2();
                oauth2Client.setCredentials({ access_token: user.socialAccounts.youtube.accessToken });
                const youtube = googleapis_1.google.youtube({ version: 'v3', auth: oauth2Client });
                // 1. Get Channel Stats & Uploads Playlist ID
                const channelResponse = await youtube.channels.list({
                    part: ['statistics', 'snippet', 'contentDetails'],
                    mine: true
                });
                if (channelResponse.data.items && channelResponse.data.items.length > 0) {
                    const channel = channelResponse.data.items[0];
                    const stats = channel.statistics;
                    // Safely access uploads playlist
                    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
                    // 2. Get Recent Videos from Uploads Playlist
                    let recentVideos = [];
                    if (uploadsPlaylistId) {
                        try {
                            const playlistResponse = await youtube.playlistItems.list({
                                playlistId: uploadsPlaylistId,
                                part: ['snippet', 'contentDetails'],
                                maxResults: 5
                            });
                            const videoIds = playlistResponse?.data?.items?.map(item => item.contentDetails?.videoId).filter(id => id);
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
                        }
                        catch (vidErr) {
                            console.error('Error fetching recent videos', vidErr);
                        }
                    }
                    // 4. Get Recent Comments (The "Inbox")
                    let recentComments = [];
                    try {
                        const commentsResponse = await youtube.commentThreads.list({
                            part: ['snippet', 'replies'],
                            allThreadsRelatedToChannelId: channel.id || undefined,
                            maxResults: 5
                        });
                        recentComments = commentsResponse.data.items?.map((thread) => {
                            const topLevel = thread.snippet?.topLevelComment?.snippet;
                            const replies = thread.replies?.comments?.map((reply) => ({
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
                    }
                    catch (commentErr) {
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
                    user.markModified('socialAccounts');
                }
            }
            catch (ytError) {
                console.error('Failed to fetch YouTube stats:', ytError.message);
            }
        }
        // Live Fetch for Facebook (and Instagram)
        if (user.socialAccounts?.facebook?.accessToken) {
            try {
                const fbAccessToken = user.socialAccounts.facebook.accessToken;
                // 1. Get Accounts (Pages)
                const accountsResponse = await axios_1.default.get(`https://graph.facebook.com/v19.0/me/accounts`, {
                    params: { access_token: fbAccessToken }
                });
                if (accountsResponse.data.data && accountsResponse.data.data.length > 0) {
                    // Use the first page for now
                    const page = accountsResponse.data.data[0];
                    const pageId = page.id;
                    const pageAccessToken = page.access_token;
                    // --- FACEBOOK STATS ---
                    // 2. Get Page Stats
                    const pageStatsResponse = await axios_1.default.get(`https://graph.facebook.com/v19.0/${pageId}`, {
                        params: {
                            fields: 'followers_count,fan_count,rating_count,talking_about_count,name,picture{url},instagram_business_account',
                            access_token: pageAccessToken
                        }
                    });
                    const pageData = pageStatsResponse.data;
                    // 3. Get Page Feed (posts)
                    const feedResponse = await axios_1.default.get(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
                        params: {
                            fields: 'id,message,created_time,full_picture,likes.summary(true).limit(0),comments.summary(true).limit(0)',
                            limit: 5,
                            access_token: pageAccessToken
                        }
                    });
                    const recentPosts = feedResponse.data.data.map((post) => ({
                        id: post.id,
                        message: post.message,
                        created_time: post.created_time,
                        full_picture: post.full_picture,
                        likes_count: post.likes?.summary?.total_count || 0,
                        comments_count: post.comments?.summary?.total_count || 0
                    }));
                    // Update DB - Facebook
                    user.socialAccounts.facebook.stats = {
                        followers_count: pageData.followers_count,
                        rating_count: pageData.rating_count,
                        engagement: 'Medium',
                        pageName: pageData.name,
                        avatarUrl: pageData.picture?.data?.url,
                        recentPosts: recentPosts
                    };
                    // --- INSTAGRAM STATS ---
                    if (pageData.instagram_business_account && pageData.instagram_business_account.id) {
                        try {
                            const igUserId = pageData.instagram_business_account.id;
                            // 1. Get IG Account Stats
                            const igAccountResponse = await axios_1.default.get(`https://graph.facebook.com/v19.0/${igUserId}`, {
                                params: {
                                    fields: 'biography,followers_count,media_count,name,profile_picture_url,username',
                                    access_token: pageAccessToken
                                }
                            });
                            const igData = igAccountResponse.data;
                            // 2. Get IG Media
                            const igMediaResponse = await axios_1.default.get(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
                                params: {
                                    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
                                    limit: 5,
                                    access_token: pageAccessToken
                                }
                            });
                            const recentMedia = igMediaResponse.data.data.map((media) => ({
                                id: media.id,
                                caption: media.caption,
                                media_type: media.media_type,
                                media_url: media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url, // Use thumbnail for videos
                                permalink: media.permalink,
                                timestamp: media.timestamp,
                                like_count: media.like_count || 0,
                                comments_count: media.comments_count || 0
                            }));
                            // Initialize instagram object if missing
                            if (!user.socialAccounts.instagram) {
                                user.socialAccounts.instagram = { stats: {} };
                            }
                            // Update DB - Instagram
                            user.socialAccounts.instagram.stats = {
                                username: igData.username,
                                followers_count: igData.followers_count,
                                media_count: igData.media_count,
                                profile_picture_url: igData.profile_picture_url,
                                recentMedia: recentMedia
                            };
                        }
                        catch (igError) {
                            console.error('Failed to fetch Instagram stats:', igError.response?.data || igError.message);
                        }
                    }
                    else {
                        // console.log('No Instagram Business Account linked to this Page.');
                    }
                    user.markModified('socialAccounts');
                }
            }
            catch (fbError) {
                console.error('Failed to fetch Facebook stats:', fbError.response?.data || fbError.message);
            }
        }
        await user.save();
        return res.json({
            youtube: user.socialAccounts?.youtube?.stats || null,
            facebook: user.socialAccounts?.facebook?.stats || null,
            instagram: user.socialAccounts?.instagram?.stats || null
        });
    }
    catch (error) {
        console.error('Get Stats Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.getSocialStats = getSocialStats;
const postYouTubeReply = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { commentId, text } = req.body;
        if (!commentId || !text) {
            return res.status(400).json({ error: 'Missing commentId or text' });
        }
        const user = await User_1.User.findById(userId);
        if (!user || !user.socialAccounts?.youtube?.accessToken) {
            return res.status(401).json({ error: 'YouTube account not connected' });
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: user.socialAccounts.youtube.accessToken });
        const youtube = googleapis_1.google.youtube({ version: 'v3', auth: oauth2Client });
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
    }
    catch (error) {
        console.error('Post YouTube Reply Error:', error.message);
        return res.status(500).json({ error: 'Failed to post reply to YouTube', details: error.message });
    }
};
exports.postYouTubeReply = postYouTubeReply;
//# sourceMappingURL=socialController.js.map