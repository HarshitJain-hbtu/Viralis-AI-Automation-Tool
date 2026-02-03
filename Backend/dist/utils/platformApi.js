"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInstagramPostId = extractInstagramPostId;
exports.extractYouTubeVideoId = extractYouTubeVideoId;
exports.fetchInstagramStats = fetchInstagramStats;
exports.fetchInstagramMediaList = fetchInstagramMediaList;
exports.getInstagramBusinessId = getInstagramBusinessId;
exports.fetchYouTubeStats = fetchYouTubeStats;
exports.fetchPlatformStats = fetchPlatformStats;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("./logger"));
/**
 * Extract Instagram Post ID from URL
 * Supports formats:
 * - https://www.instagram.com/p/ABC123/
 * - https://www.instagram.com/reel/ABC123/
 */
function extractInstagramPostId(url) {
    const match = url.match(/(?:instagram\.com)\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
}
/**
 * Extract YouTube Video ID from URL
 * Supports formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 */
function extractYouTubeVideoId(url) {
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
}
/**
 * Fetch Instagram video stats using Instagram Graph API (Business/Creator)
 * Requires: INSTAGRAM_ACCESS_TOKEN in environment
 */
async function fetchInstagramStats(shortcode) {
    if (!env_1.env.INSTAGRAM_ACCESS_TOKEN) {
        logger_1.default.warn('Instagram Access Token not configured');
        return {};
    }
    try {
        // 1. Get the IG Business Account ID first
        const igBusinessId = await getInstagramBusinessId();
        if (!igBusinessId) {
            logger_1.default.error('Could not find an Instagram Business Account linked to this token.');
            return {};
        }
        // 2. Resolve shortcode to Media ID
        const mediaId = await resolveShortcodeToId(igBusinessId, shortcode);
        if (!mediaId) {
            logger_1.default.error(`Could not resolve shortcode ${shortcode} to a Media ID.`);
            return {};
        }
        // 3. Fetch basic stats (like_count, comments_count)
        const response = await axios_1.default.get(`https://graph.facebook.com/v21.0/${mediaId}`, {
            params: {
                fields: 'like_count,comments_count,media_product_type,media_type',
                access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN
            }
        });
        const data = response.data;
        // 4. Fetch insights (reach, impressions, etc.)
        const insights = await fetchInstagramInsights(mediaId, data.media_type === 'VIDEO' || data.media_product_type === 'REELS');
        return {
            likes: data.like_count || 0,
            comments: data.comments_count || 0,
            reach: insights.reach || 0,
            impressions: insights.impressions || 0,
            engagement: (data.like_count || 0) + (data.comments_count || 0),
            engagementRate: insights.engagementRate || 0
        };
    }
    catch (error) {
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        logger_1.default.error(`Error fetching Instagram stats (${error.response?.status}): ${errorData}`);
        return {};
    }
}
/**
 * Fetch a list of media items for an Instagram Business Account
 * Mirrors the fields in the curl command: id,caption,media_type,media_url,like_count,comments_count
 */
async function fetchInstagramMediaList(instagramAccountId, limit = 25) {
    if (!env_1.env.INSTAGRAM_ACCESS_TOKEN) {
        logger_1.default.warn('Instagram Access Token not configured');
        return [];
    }
    try {
        const response = await axios_1.default.get(`https://graph.facebook.com/v21.0/${instagramAccountId}/media`, {
            params: {
                fields: 'id,caption,media_type,media_url,like_count,comments_count',
                limit,
                access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN
            }
        });
        return response.data.data || [];
    }
    catch (error) {
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        logger_1.default.error(`Error fetching Instagram media list (${error.response?.status}): ${errorData}`);
        return [];
    }
}
/**
 * Helper to get the Instagram Business Account ID from the user token
 * Supports both legacy /me/accounts and modern granular-scoped tokens
 */
async function getInstagramBusinessId() {
    // 1. Try modern granular-scoped token discovery first
    const granularId = await getInstagramBusinessIdFromGranularToken();
    if (granularId)
        return granularId;
    // 2. Fallback to legacy /me/accounts discovery
    try {
        // First get the Facebook Pages linked to the token
        const accountsRes = await axios_1.default.get('https://graph.facebook.com/v21.0/me/accounts', {
            params: { access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN }
        });
        if (!accountsRes.data.data || accountsRes.data.data.length === 0) {
            logger_1.default.warn('No Facebook Pages found linked to this access token.');
            return null;
        }
        logger_1.default.info(`Found ${accountsRes.data.data.length} Facebook Pages. Checking for linked Instagram accounts...`);
        // Then get the Instagram Business Account linked to the first page
        for (const page of accountsRes.data.data) {
            const pageId = page.id;
            const igRes = await axios_1.default.get(`https://graph.facebook.com/v21.0/${pageId}`, {
                params: {
                    fields: 'instagram_business_account,name',
                    access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN
                }
            });
            if (igRes.data.instagram_business_account?.id) {
                logger_1.default.info(`Found Instagram Business Account: ${igRes.data.instagram_business_account.id} (linked to Page: ${igRes.data.name})`);
                return igRes.data.instagram_business_account.id;
            }
        }
        return null;
    }
    catch (error) {
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        logger_1.default.error(`Error fetching Instagram Business ID (${error.response?.status}): ${errorData}`);
        return null;
    }
}
/**
 * Helper to get the Instagram Business Account ID from a granular-scoped token
 * Follows the flow: debug_token -> granular_scopes -> page_id -> instagram_business_account
 */
async function getInstagramBusinessIdFromGranularToken() {
    if (!env_1.env.FB_APP_ID || !env_1.env.FB_APP_SECRET || !env_1.env.INSTAGRAM_ACCESS_TOKEN) {
        logger_1.default.debug('Facebook App credentials or token missing, skipping granular discovery.');
        return null;
    }
    try {
        logger_1.default.info('Attempting modular discovery for granular-scoped token...');
        // 1. Debug the token to find which Page ID or Instagram Account ID it has access to
        const debugRes = await axios_1.default.get('https://graph.facebook.com/debug_token', {
            params: {
                input_token: env_1.env.INSTAGRAM_ACCESS_TOKEN,
                access_token: `${env_1.env.FB_APP_ID}|${env_1.env.FB_APP_SECRET}`
            }
        });
        const granularScopes = debugRes.data.data.granular_scopes || [];
        // 2. Collect all target IDs from relevant scopes
        const targetIds = new Set();
        granularScopes.forEach((s) => {
            if (s.target_ids) {
                s.target_ids.forEach((id) => targetIds.add(id));
            }
        });
        if (targetIds.size === 0) {
            logger_1.default.warn('No target IDs found in granular scopes.');
            return null;
        }
        // 3. Try each target ID to find the IG Business Account
        for (const targetId of targetIds) {
            try {
                // Try fetching specifically for instagram_business_account
                const res = await axios_1.default.get(`https://graph.facebook.com/v21.0/${targetId}`, {
                    params: {
                        fields: 'instagram_business_account,username',
                        access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN
                    }
                });
                if (res.data.instagram_business_account?.id) {
                    logger_1.default.info(`Found Instagram Business Account through modular discovery: ${res.data.instagram_business_account.id}`);
                    return res.data.instagram_business_account.id;
                }
                // If it doesn't have a linked account, it might be the IG ID itself
                // (e.g. if the scope was instagram_basic)
                if (res.data.username && !res.data.instagram_business_account) {
                    logger_1.default.info(`Target ID ${targetId} appears to be the Instagram Business Account itself.`);
                    return targetId;
                }
            }
            catch (e) {
                continue; // Try next ID
            }
        }
        return null;
    }
    catch (error) {
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        logger_1.default.error(`Error in granular token discovery (${error.response?.status}): ${errorData}`);
        return null;
    }
}
/**
 * Helper to find the numeric Media ID for a given shortcode
 */
async function resolveShortcodeToId(igBusinessId, shortcode) {
    try {
        // Query the first 50 media items to find the one matching the shortcode
        const mediaRes = await axios_1.default.get(`https://graph.facebook.com/v21.0/${igBusinessId}/media`, {
            params: {
                fields: 'id,shortcode',
                limit: 50,
                access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN
            }
        });
        const target = mediaRes.data.data?.find((m) => m.shortcode === shortcode);
        return target?.id || null;
    }
    catch (error) {
        logger_1.default.error(`Error resolving shortcode ${shortcode}:`, error);
        return null;
    }
}
/**
 * Fetch Instagram insights (engagement data)
 */
async function fetchInstagramInsights(mediaId, isVideo) {
    try {
        // Reels and Videos have different metric names sometimes
        const metrics = isVideo
            ? 'reach,impressions,saved,video_views'
            : 'reach,impressions,saved,engagement';
        const response = await axios_1.default.get(`https://graph.facebook.com/v21.0/${mediaId}/insights`, {
            params: {
                metric: metrics,
                access_token: env_1.env.INSTAGRAM_ACCESS_TOKEN
            }
        });
        const insights = {};
        if (response.data.data) {
            response.data.data.forEach((item) => {
                insights[item.name] = item.values?.[0]?.value || 0;
            });
        }
        // Map video_views to reach if needed, or just return what we have
        if (insights.video_views)
            insights.reach = insights.video_views;
        return insights;
    }
    catch (error) {
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        logger_1.default.error(`Error fetching Instagram insights for ${mediaId} (${error.response?.status}): ${errorData}`);
        return {};
    }
}
/**
 * Fetch YouTube video stats using YouTube Data API
 * Requires: YOUTUBE_API_KEY in environment
 */
async function fetchYouTubeStats(videoId) {
    if (!env_1.env.YOUTUBE_API_KEY) {
        logger_1.default.warn('YouTube API Key not configured');
        return {};
    }
    try {
        const response = await axios_1.default.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                id: videoId,
                part: 'statistics,contentDetails',
                key: env_1.env.YOUTUBE_API_KEY
            }
        });
        if (!response.data.items || response.data.items.length === 0) {
            logger_1.default.warn(`YouTube video not found: ${videoId}`);
            return {};
        }
        const stats = response.data.items[0].statistics;
        const views = parseInt(stats.viewCount || '0');
        const likes = parseInt(stats.likeCount || '0');
        const comments = parseInt(stats.commentCount || '0');
        const engagement = likes + comments;
        return {
            views,
            likes,
            comments,
            engagement,
            engagementRate: views > 0 ? ((engagement / views) * 100).toFixed(2) : 0
        };
    }
    catch (error) {
        logger_1.default.error('Error fetching YouTube stats:', error);
        return {};
    }
}
/**
 * Fetch stats based on platform
 */
async function fetchPlatformStats(videoUrl, platform) {
    if (platform === 'instagram') {
        const postId = extractInstagramPostId(videoUrl);
        if (!postId) {
            logger_1.default.error('Invalid Instagram URL:', videoUrl);
            return {};
        }
        return fetchInstagramStats(postId);
    }
    else if (platform === 'youtube') {
        const videoId = extractYouTubeVideoId(videoUrl);
        if (!videoId) {
            logger_1.default.error('Invalid YouTube URL:', videoUrl);
            return {};
        }
        return fetchYouTubeStats(videoId);
    }
    return {};
}
//# sourceMappingURL=platformApi.js.map