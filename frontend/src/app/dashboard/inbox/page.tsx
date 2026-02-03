'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, CornerUpLeft, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InboxPage() {
    const { socialStats, fetchSocialStats } = useAuthStore();
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [activeTab, setActiveTab] = useState<'all' | 'unanswered'>('unanswered');
    const [repliedCommentIds, setRepliedCommentIds] = useState<Set<string>>(new Set());
    // Store local replies to display them immediately
    const [localReplies, setLocalReplies] = useState<{ [key: string]: { text: string, timestamp: Date } }>({});

    useEffect(() => {
        if (!socialStats) {
            fetchSocialStats();
        }
    }, [socialStats, fetchSocialStats]);

    const comments = socialStats?.youtube?.recentComments || [];

    const handleReplyChange = (id: string, text: string) => {
        setReplyText(prev => ({ ...prev, [id]: text }));
    };

    const handleSendReply = async (commentId: string) => {
        const text = replyText[commentId];
        if (!text) return;

        try {
            await useAuthStore.getState().replyToComment(commentId, text);

            // Optimistically mark as replied and store content
            setRepliedCommentIds(prev => new Set(prev).add(commentId));
            setLocalReplies(prev => ({
                ...prev,
                [commentId]: { text, timestamp: new Date() }
            }));
            setReplyText(prev => ({ ...prev, [commentId]: '' }));

            // Optional/Ideal: Show success toast
        } catch (error) {
            console.error('Failed to reply', error);
            alert('Failed to send reply. Please try again.');
        }
    };

    const filteredComments = comments.filter((comment: any) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unanswered') {
            // Check if it has replies from API data OR if we just replied to it locally
            const hasReplies = (comment.totalReplyCount > 0) || repliedCommentIds.has(comment.id);
            return !hasReplies;
        }
        return true;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Engagement Inbox</h1>
                    <p className="text-muted-foreground mt-1">Manage comments and community interactions from one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                        <MessageSquare className="w-4 h-4" /> Sync Comments
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">

                {/* Comment List */}
                <Card className="lg:col-span-12 h-full flex flex-col border-gray-200 shadow-sm bg-white">
                    <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-4">
                            <Button
                                variant={activeTab === 'all' ? 'secondary' : 'ghost'}
                                onClick={() => setActiveTab('all')}
                                className="rounded-full px-4 h-8 text-sm font-medium"
                            >
                                All Comments
                            </Button>
                            <Button
                                variant={activeTab === 'unanswered' ? 'secondary' : 'ghost'}
                                onClick={() => setActiveTab('unanswered')}
                                className="rounded-full px-4 h-8 text-sm font-medium text-muted-foreground"
                            >
                                Unanswered
                            </Button>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search comments..." className="pl-9 h-9 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        {filteredComments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                <p>No comments found.</p>
                                <Button variant="link" onClick={() => fetchSocialStats()}>Refresh</Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredComments.map((comment: any) => (
                                    <div key={comment.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                                        <div className="flex gap-4">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarImage src={comment.authorProfileImageUrl} />
                                                <AvatarFallback>{comment.authorDisplayName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-sm text-gray-900">{comment.authorDisplayName}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-muted-foreground">{new Date(comment.publishedAt).toLocaleString()}</p>
                                                            {comment.videoId && (
                                                                <a
                                                                    href={`https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[10px] text-blue-600 hover:underline flex items-center"
                                                                >
                                                                    View on YouTube
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </div>

                                                <p className="text-gray-800 text-sm leading-relaxed">{comment.textDisplay}</p>

                                                {/* Local Reply Display */}
                                                {localReplies[comment.id] && (
                                                    <div className="mt-3 ml-2 pl-4 border-l-2 border-blue-200">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-semibold text-blue-600">You (Posting...)</span>
                                                            <span className="text-[10px] text-muted-foreground">{localReplies[comment.id].timestamp.toLocaleTimeString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">{localReplies[comment.id].text}</p>
                                                    </div>
                                                )}

                                                {/* API Replies Display */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="space-y-3 mt-3">
                                                        {comment.replies.map((reply: any) => (
                                                            <div key={reply.id} className="ml-2 pl-4 border-l-2 border-gray-200">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Avatar className="w-6 h-6">
                                                                        <AvatarImage src={reply.authorProfileImageUrl} />
                                                                        <AvatarFallback>{reply.authorDisplayName?.[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-xs font-semibold text-gray-900">{reply.authorDisplayName}</span>
                                                                    <span className="text-[10px] text-muted-foreground">{new Date(reply.publishedAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-700">{reply.textDisplay}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="flex items-center gap-1.5 min-w-[3rem]">
                                                        <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                                                        <span className="text-xs font-medium text-gray-500">{comment.likeCount}</span>
                                                    </div>

                                                    {/* Quick Reply Box - Hide if already replied locally (optional? user might want to reply again. let's keep it but maybe clear it) */}
                                                    <div className="flex-1 max-w-2xl flex gap-2">
                                                        <Input
                                                            placeholder="Write a reply..."
                                                            className="h-8 text-xs bg-white"
                                                            value={replyText[comment.id] || ''}
                                                            onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.id)}
                                                        />
                                                        {replyText[comment.id] && (
                                                            <Button size="sm" className="h-8 px-3" onClick={() => handleSendReply(comment.id)}>
                                                                <CornerUpLeft className="w-3 h-3 mr-1" /> Reply
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

