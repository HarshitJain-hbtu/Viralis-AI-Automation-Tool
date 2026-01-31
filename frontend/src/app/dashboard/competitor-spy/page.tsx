'use client';

import { useState } from 'react';
import { analyzeCompetitorAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Instagram,
    Youtube,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    MessageCircle,
    Heart,
    Zap,
    Lightbulb,
    ArrowRight,
    Loader2,
    Lock,
    Target,
    BarChart2,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CompetitorSpyPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState<'instagram' | 'youtube'>('instagram');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [data, setData] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!username) return;
        setIsAnalyzing(true);
        setData(null);

        try {
            const result = await analyzeCompetitorAction(username, platform);
            setData(result);
        } catch (error) {
            console.error("Analysis failed:", error);
            // In a real app, use toast here
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            alert(`Analysis failed: ${errorMessage}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAnalyze();
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-12">
            <main className="max-w-[1600px] mx-auto px-8 py-6">

                {/* Header Section */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <Badge variant="outline" className="mb-4 bg-white px-3 py-1 text-xs uppercase tracking-widest text-gray-500 border-gray-200">
                        Agentic Intelligence
                    </Badge>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Competitor Spy</h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Reverse-engineer what works in your niche. Enter a competitor to uncover their viral secrets.
                    </p>

                    <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 max-w-lg mx-auto">
                        <div className="flex bg-gray-50 rounded-xl p-1">
                            <button
                                onClick={() => setPlatform('instagram')}
                                className={`p-2 rounded-lg transition-all ${platform === 'instagram' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Instagram className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPlatform('youtube')}
                                className={`p-2 rounded-lg transition-all ${platform === 'youtube' ? 'bg-white shadow-sm text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Youtube className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={platform === 'instagram' ? "@username" : "Channel URL"}
                            className="border-0 shadow-none focus-visible:ring-0 text-base flex-1 w-full bg-transparent placeholder:text-gray-400 text-gray-900"
                        />
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !username}
                            className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-6 h-10 font-medium"
                        >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                        </Button>
                    </div>
                </div>

                {isAnalyzing ? (
                    <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4 space-y-6">
                                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                                <div className="h-48 bg-gray-200 rounded-2xl"></div>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                ) : !data ? (
                    <div className="text-center py-20 max-w-2xl mx-auto">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 transform hover:-translate-y-1 transition-transform duration-500">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to spy on the competition?</h3>
                            <p className="text-gray-500 mb-6">
                                Enter an Instagram username or YouTube channel to unlock deep AI insights, hidden viral patterns, and content gaps you can exploit.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="px-3 py-1 bg-gray-50 text-gray-600">@alexhormozi</Badge>
                                <Badge variant="secondary" className="px-3 py-1 bg-gray-50 text-gray-600">@garyvee</Badge>
                                <Badge variant="secondary" className="px-3 py-1 bg-gray-50 text-gray-600">@codie_sanchez</Badge>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard
                                    label="Followers"
                                    value={data.profile.followers.toLocaleString()}
                                    icon={Users}
                                    trend="High"
                                />
                                <StatsCard
                                    label="Avg Views"
                                    value={data.profile.avgViews.toLocaleString()}
                                    icon={Eye}
                                    subtext="Last 30 posts"
                                />
                                <StatsCard
                                    label="Engagement"
                                    value={data.profile.engagementRate}
                                    icon={TrendingUp}
                                    trendColor="text-green-600"
                                />
                                <StatsCard
                                    label="Growth Velocity"
                                    value={data.profile.growthVelocity}
                                    icon={Zap}
                                    trendColor="text-orange-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                                {/* Left Column: Analysis & Insights */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Viral Patterns */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-gray-900">Viral Patterns</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Winning Hooks</h4>
                                                <div className="space-y-3">
                                                    {data.analysis.viralPatterns.hooks.map((hook: string, i: number) => (
                                                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
                                                            <span className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs border border-gray-200 font-bold text-gray-500">{i + 1}</span>
                                                            {hook}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Visual Style</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.analysis.viralPatterns.visuals.map((visual: string, i: number) => (
                                                        <Badge key={i} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 font-medium">
                                                            {visual}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Why It Works */}
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                                        <div className="flex items-center gap-2 mb-4">
                                            <SparklesIcon className="w-5 h-5 text-yellow-400" />
                                            <h3 className="font-bold">Why It Works</h3>
                                        </div>
                                        <div className="space-y-4 text-sm text-gray-300">
                                            <p><strong className="text-white">Psychology:</strong> {data.analysis.whyItWorks.psychology}</p>
                                            <p><strong className="text-white">Structure:</strong> {data.analysis.whyItWorks.structure}</p>
                                        </div>
                                    </div>

                                    {/* Opportunities */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                                <Lightbulb className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-gray-900">Opportunities</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {data.analysis.opportunities.map((opp: any, i: number) => (
                                                <div key={i} className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-gray-900 text-sm">{opp.title}</h4>
                                                        <Badge className="bg-white text-green-700 border-green-200 text-[10px] h-5">{opp.difficulty}</Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-600 leading-relaxed">{opp.description}</p>
                                                    <button
                                                        onClick={() => router.push(`/dashboard/studio?prompt=Create a reel about ${opp.title}`)}
                                                        className="mt-3 text-xs font-bold text-green-700 flex items-center gap-1 hover:gap-2 transition-all"
                                                    >
                                                        Steal this idea <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Content Grid */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 text-lg">Top Performing Content</h3>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="bg-white cursor-pointer hover:bg-gray-50">Most Views</Badge>
                                            <Badge variant="outline" className="bg-white text-gray-400 cursor-pointer hover:bg-gray-50 hover:text-gray-700 border-transparent">Newest</Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.profile.posts.slice(0, 6).map((post: any) => (
                                            <div key={post.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative">
                                                {/* Why It Worked Badge (AI) */}
                                                {post.whyWorked && (
                                                    <div className="absolute top-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="bg-black/80 backdrop-blur-md text-white text-[10px] p-2 rounded-lg border border-white/10 shadow-lg">
                                                            <span className="font-bold text-yellow-400 block mb-0.5 flex items-center gap-1">
                                                                <Sparkles className="w-3 h-3" /> AI Insight
                                                            </span>
                                                            {post.whyWorked}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Mock Thumbnail Area */}
                                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${post.thumbnail})` }}></div>
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                                        <Eye className="w-3 h-3" /> {formatNumber(post.views)}
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-2 py-1 rounded-lg">
                                                        {post.type}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-3 leading-relaxed">
                                                        {post.caption}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(post.likes)}</span>
                                                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatNumber(post.comments)}</span>
                                                        </div>
                                                        <span>{new Date(post.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}

function StatsCard({ label, value, icon: Icon, subtext, trend, trendColor }: any) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <Badge variant="outline" className={`border-0 bg-green-50 text-green-700 ${trendColor}`}>
                        {trend}
                    </Badge>
                )}
            </div>
            <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">{value}</h4>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}

function formatNumber(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}
