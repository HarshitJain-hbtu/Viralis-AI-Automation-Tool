export interface VideoStats {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    impressions?: number;
    reach?: number;
    saves?: number;
    engagement?: number;
    engagementRate?: number;
}
export interface InstagramMediaItem {
    id: string;
    caption?: string;
    media_type: string;
    media_url?: string;
    like_count?: number;
    comments_count?: number;
}
/**
 * Extract Instagram Post ID from URL
 * Supports formats:
 * - https://www.instagram.com/p/ABC123/
 * - https://www.instagram.com/reel/ABC123/
 */
export declare function extractInstagramPostId(url: string): string | null;
/**
 * Extract YouTube Video ID from URL
 * Supports formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 */
export declare function extractYouTubeVideoId(url: string): string | null;
/**
 * Fetch Instagram video stats using Instagram Graph API (Business/Creator)
 * Requires: INSTAGRAM_ACCESS_TOKEN in environment
 */
export declare function fetchInstagramStats(shortcode: string): Promise<VideoStats>;
/**
 * Fetch a list of media items for an Instagram Business Account
 * Mirrors the fields in the curl command: id,caption,media_type,media_url,like_count,comments_count
 */
export declare function fetchInstagramMediaList(instagramAccountId: string, limit?: number): Promise<InstagramMediaItem[]>;
/**
 * Helper to get the Instagram Business Account ID from the user token
 * Supports both legacy /me/accounts and modern granular-scoped tokens
 */
export declare function getInstagramBusinessId(): Promise<string | null>;
/**
 * Fetch YouTube video stats using YouTube Data API
 * Requires: YOUTUBE_API_KEY in environment
 */
export declare function fetchYouTubeStats(videoId: string): Promise<VideoStats>;
/**
 * Fetch stats based on platform
 */
export declare function fetchPlatformStats(videoUrl: string, platform: 'instagram' | 'youtube'): Promise<VideoStats>;
//# sourceMappingURL=platformApi.d.ts.map