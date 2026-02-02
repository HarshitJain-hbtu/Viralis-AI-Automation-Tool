import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, Instagram, Youtube, Twitter, Zap, BarChart3, Target, ArrowLeft, Clock, Copy, Hash, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface ContentItem {
    id: string;
    title: string;
    caption?: string;
    hashtags?: string[];
    visual_prompt?: string;
    best_time?: string;
    date: Date;
    status: 'posted' | 'scheduled' | 'draft';
    platform: 'instagram' | 'youtube' | 'twitter' | 'tiktok';
    strategyType?: 'viral' | 'reach' | 'niche';
}

export function ContentCalendar() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [content, setContent] = useState<ContentItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewingPost, setViewingPost] = useState<ContentItem | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/ai/get-posts", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const formattedPosts = data.posts.map((post: any) => ({
                        id: post.id || Math.random().toString(),
                        title: post.hook || "Untitled Post",
                        caption: post.caption,
                        hashtags: post.hashtags || [],
                        visual_prompt: post.visual_prompt,
                        best_time: post.best_time,
                        date: new Date(post.scheduledDate || post.date || new Date()),
                        status: post.status || 'scheduled',
                        platform: post.platform ? post.platform.toLowerCase() : 'instagram',
                        strategyType: post.strategyType
                    }));
                    setContent(formattedPosts);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <Instagram className="w-3 h-3" />;
            case 'youtube': return <Youtube className="w-3 h-3" />;
            case 'twitter': return <Twitter className="w-3 h-3" />;
            default: return null;
        }
    };

    const getStrategyIcon = (type?: string) => {
        switch (type) {
            case 'viral': return <Zap className="w-3 h-3 text-amber-500" />;
            case 'reach': return <BarChart3 className="w-3 h-3 text-blue-500" />;
            case 'niche': return <Target className="w-3 h-3 text-purple-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'posted': return 'bg-green-100 text-green-700 border-green-200';
            case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setViewingPost(null);
        setIsDialogOpen(true);
    };

    const toggleTaskStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'posted' ? 'scheduled' : 'posted';

        // Optimistic update
        setContent(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));

        try {
            await fetch("http://localhost:5000/api/ai/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ postId: id, status: newStatus })
            });
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure
            setContent(prev => prev.map(c => c.id === id ? { ...c, status: currentStatus as any } : c));
        }
    };

    const renderDays = () => {
        const days = [];
        // Empty cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/30 border-b border-r border-gray-100" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayContent = content.filter(c =>
                c.date.getDate() === day &&
                c.date.getMonth() === currentDate.getMonth() &&
                c.date.getFullYear() === currentDate.getFullYear()
            );
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    onClick={() => handleDayClick(date)}
                    className={cn(
                        "h-32 p-2 border-b border-r border-gray-100 relative group transition-colors hover:bg-gray-50 cursor-pointer",
                        isToday && "bg-blue-50/30"
                    )}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                            "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                            isToday ? "bg-blue-600 text-white" : "text-gray-700"
                        )}>
                            {day}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity">
                            <Plus className="w-3 h-3 text-gray-500" />
                        </div>
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[88px] no-scrollbar">
                        {dayContent.map(item => (
                            <div key={item.id} className={cn(
                                "text-[10px] p-1.5 rounded border border-l-2 truncate flex items-center gap-1.5",
                                getStatusColor(item.status)
                            )}>
                                {getStrategyIcon(item.strategyType)}
                                <span className={cn("truncate flex-1", item.status === 'posted' && "line-through opacity-70")}>
                                    {item.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Remaining cells
        const totalCells = days.length;
        const remainingCells = 42 - totalCells;
        for (let i = 0; i < remainingCells; i++) {
            days.push(<div key={`remaining-${i}`} className="h-32 bg-gray-50/30 border-b border-r border-gray-100" />);
        }

        return days;
    };

    const selectedDayContent = selectedDate ? content.filter(c =>
        c.date.getDate() === selectedDate.getDate() &&
        c.date.getMonth() === selectedDate.getMonth() &&
        c.date.getFullYear() === selectedDate.getFullYear()
    ) : [];

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="ml-4 flex gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push('/dashboard/ai-calendar')}>
                                <Plus className="w-4 h-4 mr-1.5" />
                                Create
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                    {renderDays()}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl">
                    {viewingPost ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewingPost(null)}>
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <DialogTitle>Post Details</DialogTitle>
                                </div>
                                <DialogDescription>
                                    {viewingPost.date.toDateString()} • <span className="capitalize">{viewingPost.platform}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">"{viewingPost.title}"</h3>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Caption</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {viewingPost.caption || "No caption available."}
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-6 px-2" onClick={() => {
                                        navigator.clipboard.writeText(viewingPost.caption || "");
                                    }}>
                                        <Copy className="h-3 w-3 mr-1.5" /> Copy Caption
                                    </Button>
                                </div>

                                {viewingPost.visual_prompt && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <ImageIcon className="h-3 w-3" /> Visual Prompt
                                        </h4>
                                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-md">
                                            {viewingPost.visual_prompt}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <Hash className="h-3 w-3" /> Hashtags
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {viewingPost.hashtags?.map(tag => (
                                                <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {viewingPost.best_time && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" /> Best Time
                                            </h4>
                                            <p className="text-sm font-medium text-gray-700">{viewingPost.best_time}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedDate?.toDateString()}</DialogTitle>
                                <DialogDescription>
                                    Manage your content tasks for this day.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 py-4">
                                {selectedDayContent.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8 text-sm">
                                        No tasks scheduled for this day.
                                    </div>
                                ) : (
                                    selectedDayContent.map(item => (
                                        <div key={item.id} className="group flex items-start space-x-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setViewingPost(item)}>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    id={item.id}
                                                    checked={item.status === 'posted'}
                                                    onCheckedChange={() => toggleTaskStatus(item.id, item.status)}
                                                />
                                            </div>
                                            <div className="grid gap-1.5 leading-none flex-1">
                                                <label
                                                    htmlFor={item.id}
                                                    className={cn(
                                                        "text-sm font-medium leading-none cursor-pointer",
                                                        item.status === 'posted' && "line-through text-gray-500"
                                                    )}
                                                >
                                                    {item.title}
                                                </label>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    {getStrategyIcon(item.strategyType)}
                                                    <span className="capitalize">{item.strategyType || 'Post'}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{item.platform}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
