'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/authStore';
import { Youtube, Activity } from 'lucide-react';
import { YouTubeVideo, YouTubeComment, FacebookPost, InstagramMedia } from '../lib/types/socials';

export function SocialStats() {
    const { socialStats, fetchSocialStats } = useAuthStore();

    // Fetch stats on mount if not available? 
    // Usually handled by parent or useEffect here.
    // For now, assume parent triggers it or we add useEffect.

    if (!socialStats) {
        return (
            <Card className="!bg-white !text-gray-900 !border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="!text-gray-500">Connect accounts to see stats.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* YouTube Dashboard */}
            {socialStats.youtube && (
                <div className="space-y-6">
                    {/* Header: Channel Branding */}
                    <div className="flex items-center gap-4">
                        {socialStats.youtube.avatarUrl && (
                            <img
                                src={socialStats.youtube.avatarUrl}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full border-2 border-red-600"
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{socialStats.youtube.channelTitle || 'YouTube Channel'}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Youtube className="w-4 h-4 text-red-600" />
                                <span>Connected</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="!bg-white !text-gray-900 !border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                                <Youtube className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.youtube.subscriberCount || 'N/A'}</div>
                            </CardContent>
                        </Card>
                        <Card className="!bg-white !text-gray-900 !border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{parseInt(socialStats.youtube.viewCount || '0').toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card className="!bg-white !text-gray-900 !border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Video Count</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.youtube.videoCount || 0}</div>
                            </CardContent>
                        </Card>
                        <Card className="!bg-white !text-gray-900 !border-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Views / Video</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {parseInt(socialStats.youtube.videoCount || '0') > 0
                                        ? Math.round(parseInt(socialStats.youtube.viewCount || '0') / parseInt(socialStats.youtube.videoCount || '0')).toLocaleString()
                                        : 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Videos Section */}
                    {socialStats.youtube.recentVideos && socialStats.youtube.recentVideos.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Recent Video Performance</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                                {socialStats.youtube.recentVideos.map((video: YouTubeVideo) => (
                                    <Card key={video.id} className="overflow-hidden !bg-white !text-gray-900 !border-gray-200">
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        </div>
                                        <CardContent className="p-4">
                                            <h4 className="font-medium line-clamp-2 mb-2 h-12 !text-gray-900">{video.title}</h4>
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">{parseInt(video.viewCount).toLocaleString()}</span> views
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">{parseInt(video.likeCount).toLocaleString()}</span> likes
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Engagement Inbox (Comments) */}
                    {socialStats.youtube.recentComments && socialStats.youtube.recentComments.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Latest Engagement</h3>
                            <Card className="!bg-white !text-gray-900 !border-gray-200">
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {socialStats.youtube.recentComments.map((comment: YouTubeComment) => (
                                            <div key={comment.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                                                <img
                                                    src={comment.authorProfileImageUrl}
                                                    alt={comment.authorDisplayName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold text-gray-900">{comment.authorDisplayName}</p>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(comment.publishedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-2 [&>a]:text-blue-600 [&>a]:hover:underline"
                                                        dangerouslySetInnerHTML={{ __html: comment.textDisplay }}
                                                    />
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                                                        <span className="flex items-center gap-1">
                                                            👍 {comment.likeCount}
                                                        </span>
                                                        <button className="text-blue-600 hover:underline">Reply on YouTube</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {/* Facebook Dashboard */}
            {socialStats.facebook && (
                <div className="space-y-6 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        {socialStats.facebook.avatarUrl && (
                            <img
                                src={socialStats.facebook.avatarUrl}
                                alt="Facebook Avatar"
                                className="w-16 h-16 rounded-full border-2 border-blue-600"
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{socialStats.facebook.pageName || 'Facebook Page'}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">f</div>
                                <span>Connected</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                                <Activity className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.facebook.followers_count || 'N/A'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.facebook.rating_count || 'N/A'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Page Engagement</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.facebook.engagement || 'N/A'}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {socialStats.facebook.recentPosts && socialStats.facebook.recentPosts.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                                {socialStats.facebook.recentPosts.map((post: FacebookPost) => (
                                    <Card key={post.id} className="overflow-hidden">
                                        {post.full_picture && (
                                            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                                <img src={post.full_picture} alt="Post" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <CardContent className="p-4">
                                            <p className="text-sm text-gray-700 line-clamp-3 mb-3 h-14">
                                                {post.message || 'No description'}
                                            </p>
                                            <div className="flex justify-between text-sm text-muted-foreground border-t pt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-foreground">
                                                        {post.likes_count}
                                                    </span> Likes
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-foreground">
                                                        {post.comments_count}
                                                    </span> Comments
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-400">
                                                {new Date(post.created_time).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Instagram Dashboard */}
            {socialStats.instagram && (
                <div className="space-y-6 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        {socialStats.instagram.profile_picture_url && (
                            <img
                                src={socialStats.instagram.profile_picture_url}
                                alt="Instagram Avatar"
                                className="w-16 h-16 rounded-full border-2 border-pink-500"
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{socialStats.instagram.username || 'Instagram Business'}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-4 h-4 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-sm flex items-center justify-center text-white">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-3 h-3" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </div>
                                <span>Connected</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                                <Activity className="h-4 w-4 text-pink-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.instagram.followers_count || 'N/A'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Media Count</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.instagram.media_count || 'N/A'}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {socialStats.instagram.recentMedia && socialStats.instagram.recentMedia.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Recent Media</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                                {socialStats.instagram.recentMedia.map((media: InstagramMedia) => (
                                    <Card key={media.id} className="overflow-hidden !bg-white !text-gray-900 !border-gray-200">
                                        <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                                            {media.media_type === 'VIDEO' && (
                                                <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Reel</span>
                                            )}
                                            <img src={media.media_url} alt="Media" className="w-full h-full object-cover" />
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-sm text-gray-700 line-clamp-2 mb-3 h-10">
                                                {media.caption || 'No caption'}
                                            </p>
                                            <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">
                                                        {media.like_count}
                                                    </span> Likes
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">
                                                        {media.comments_count}
                                                    </span> Comments
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-400">
                                                {new Date(media.timestamp).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
