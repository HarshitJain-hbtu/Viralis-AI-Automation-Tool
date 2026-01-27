'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/authStore';
import { Youtube, Activity } from 'lucide-react';

export function SocialStats() {
    const { socialStats, fetchSocialStats } = useAuthStore();

    // Fetch stats on mount if not available? 
    // Usually handled by parent or useEffect here.
    // For now, assume parent triggers it or we add useEffect.

    if (!socialStats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Connect accounts to see stats.</p>
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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                                <Youtube className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.youtube.subscriberCount || 'N/A'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{parseInt(socialStats.youtube.viewCount || '0').toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Video Count</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{socialStats.youtube.videoCount || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Views / Video</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {socialStats.youtube.videoCount > 0
                                        ? Math.round(parseInt(socialStats.youtube.viewCount || '0') / parseInt(socialStats.youtube.videoCount)).toLocaleString()
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
                                {socialStats.youtube.recentVideos.map((video: any) => (
                                    <Card key={video.id} className="overflow-hidden">
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        </div>
                                        <CardContent className="p-4">
                                            <h4 className="font-medium line-clamp-2 mb-2 h-12">{video.title}</h4>
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-foreground">{parseInt(video.viewCount).toLocaleString()}</span> views
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-foreground">{parseInt(video.likeCount).toLocaleString()}</span> likes
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
                            <Card>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {socialStats.youtube.recentComments.map((comment: any) => (
                                            <div key={comment.id} className="p-4 flex gap-4 hover:bg-muted/50 transition-colors">
                                                <img
                                                    src={comment.authorProfileImageUrl}
                                                    alt={comment.authorDisplayName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold">{comment.authorDisplayName}</p>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(comment.publishedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap line-clamp-2">{comment.textDisplay}</p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
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
        </div>
    );
}
