
export interface YouTubeVideo {
    id: string;
    thumbnail: string;
    title: string;
    viewCount: string;
    likeCount: string;
}

export interface YouTubeComment {
    id: string;
    authorProfileImageUrl: string;
    authorDisplayName: string;
    publishedAt: string;
    textDisplay: string;
    likeCount: number;
}

export interface YouTubeStats {
    channelTitle?: string;
    avatarUrl?: string;
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
    recentVideos?: YouTubeVideo[];
    recentComments?: YouTubeComment[];
}

export interface FacebookPost {
    id: string;
    full_picture?: string;
    message?: string;
    likes_count: number;
    comments_count: number;
    created_time: string;
}

export interface FacebookStats {
    pageName?: string;
    avatarUrl?: string;
    followers_count?: number;
    rating_count?: number;
    engagement?: number;
    recentPosts?: FacebookPost[];
}

export interface InstagramMedia {
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    caption?: string;
    like_count: number;
    comments_count: number;
    timestamp: string;
}

export interface InstagramStats {
    username?: string;
    profile_picture_url?: string;
    followers_count?: number;
    media_count?: number;
    recentMedia?: InstagramMedia[];
}

export interface SocialStats {
    youtube?: YouTubeStats;
    facebook?: FacebookStats;
    instagram?: InstagramStats;
}
