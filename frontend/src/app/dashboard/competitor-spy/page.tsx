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
    Users,
    Eye,
    MessageCircle,
    Heart,
    Zap,
    Lightbulb,
    ArrowRight,
    Loader2,
    Target,
    BarChart2,
    Sparkles,
    Play
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
        <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900">
            {/* Subtle background gradience - distinctive for premium SaaS */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white opacity-40" />

            <main className="max-w-[1280px] mx-auto px-6 py-16">

                {/* Hero / Header Section */}
                <div className="mb-20 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-[11px] font-medium uppercase tracking-widest text-slate-500 mb-6 shadow-sm">
                            <Sparkles className="w-3 h-3 text-slate-400" />
                            <span>Competitive Intelligence</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.1]">
                            Analyze what wins <br className="hidden md:block" /> in your niche.
                        </h1>

                        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg mx-auto font-medium">
                            Reverse-engineer viral content in seconds. Uncover hidden patterns and content gaps you can exploit.
                        </p>
                    </motion.div>

                    {/* Premium Search Module */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="relative z-20 mx-auto max-w-xl group"
                    >
                        <div className={`
                            flex items-center gap-1 p-1.5 pl-2 rounded-2xl bg-white border transition-all duration-200 shadow-xl shadow-slate-200/40
                            ${isAnalyzing
                                ? 'border-slate-300 ring-4 ring-slate-100'
                                : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100'
                            }
                        `}>
                            {/* Platform Select */}
                            <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100/50">
                                <button
                                    onClick={() => setPlatform('instagram')}
                                    className={`
                                        p-2 rounded-lg transition-all duration-200 
                                        ${platform === 'instagram'
                                            ? 'bg-white shadow-sm text-pink-600 border border-slate-100'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                                        }
                                    `}
                                >
                                    <Instagram className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPlatform('youtube')}
                                    className={`
                                        p-2 rounded-lg transition-all duration-200
                                        ${platform === 'youtube'
                                            ? 'bg-white shadow-sm text-red-600 border border-slate-100'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                                        }
                                    `}
                                >
                                    <Youtube className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Input */}
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={platform === 'instagram' ? "Enter username (e.g. @hormozi)" : "Enter Channel URL"}
                                className="border-0 shadow-none focus-visible:ring-0 text-[15px] font-medium flex-1 bg-transparent placeholder:text-slate-400 text-slate-900 h-10 px-3"
                            />

                            {/* Action Button */}
                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !username}
                                className={`
                                    h-11 px-6 rounded-xl font-semibold text-white shadow-md transition-all duration-200 flex items-center gap-2
                                    ${isAnalyzing
                                        ? 'bg-slate-800'
                                        : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg'
                                    }
                                `}
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <span className="text-sm">Analyze</span>}
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Content Area */}
                {isAnalyzing ? (
                    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-slate-100 rounded-xl border border-slate-200/50"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4 space-y-6">
                                <div className="h-72 bg-slate-100 rounded-2xl border border-slate-200/50"></div>
                                <div className="h-48 bg-slate-100 rounded-2xl border border-slate-200/50"></div>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="h-[500px] bg-slate-100 rounded-2xl border border-slate-200/50"></div>
                            </div>
                        </div>
                    </div>
                ) : !data ? (
                    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                        {/* Empty State / Quick Suggest */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center"
                        >
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 mb-2">Research a market leader</h3>
                            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                                Start by analyzing a top creator to see their content strategy.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['@alexhormozi', '@garyvee', '@codie_sanchez', '@mrbeast'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setUsername(item.replace('@', ''))}
                                        className="text-xs font-medium px-4 py-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-100 transition-all hover:-translate-y-0.5"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-[1240px] mx-auto space-y-8"
                        >
                            {/* Key Stats Grid - Enterprise Style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard
                                    label="Total Followers"
                                    value={data.profile.followers.toLocaleString()}
                                    icon={Users}
                                    trend="Top 1%"
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
                                />
                                <StatsCard
                                    label="Growth Velocity"
                                    value={data.profile.growthVelocity}
                                    icon={Zap}
                                    highlight
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Column: Intelligence */}
                                <div className="lg:col-span-4 space-y-6">

                                    {/* Viral Patterns */}
                                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-6">
                                            <div className="p-1.5 bg-blue-50/50 rounded-md text-blue-600 border border-blue-100">
                                                <Target className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-[15px] font-semibold text-slate-900">Viral Patterns</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Winning Hooks</h4>
                                                <div className="space-y-2.5">
                                                    {data.analysis.viralPatterns.hooks.map((hook: string, i: number) => (
                                                        <div key={i} className="flex gap-3 text-sm text-slate-700 leading-snug">
                                                            <span className="flex-shrink-0 w-5 h-5 bg-slate-50 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-100">{i + 1}</span>
                                                            <span className="font-medium">{hook}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Visual Style</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {data.analysis.viralPatterns.visuals.map((visual: string, i: number) => (
                                                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-[11px] font-medium text-slate-600">
                                                            {visual}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Why It Works - Dark Card (Premium Focus) */}
                                    <div className="bg-slate-900 rounded-xl p-6 shadow-lg text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                                        <div className="flex items-center gap-2.5 mb-5 relative z-10">
                                            <Sparkles className="w-4 h-4 text-yellow-300" />
                                            <h3 className="text-[15px] font-semibold">The Logic</h3>
                                        </div>

                                        <div className="space-y-5 text-sm relative z-10">
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Psychology</p>
                                                <p className="text-slate-200 leading-relaxed opacity-90">{data.analysis.whyItWorks.psychology}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Structure</p>
                                                <p className="text-slate-200 leading-relaxed opacity-90">{data.analysis.whyItWorks.structure}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Opportunities */}
                                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-6">
                                            <div className="p-1.5 bg-emerald-50/50 rounded-md text-emerald-600 border border-emerald-100">
                                                <Lightbulb className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-[15px] font-semibold text-slate-900">Opportunities</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {data.analysis.opportunities.map((opp: any, i: number) => (
                                                <div key={i} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white hover:border-emerald-200/50 hover:shadow-sm transition-all group">
                                                    <div className="flex justify-between items-start mb-1.5">
                                                        <h4 className="font-semibold text-slate-900 text-sm">{opp.title}</h4>
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">{opp.difficulty}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{opp.description}</p>
                                                    <button
                                                        onClick={() => router.push(`/dashboard/studio?prompt=Create a reel about ${opp.title}`)}
                                                        className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-1.5 transition-all"
                                                    >
                                                        Generate this <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Content Grid */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-900 text-base">Top Performing Content</h3>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none font-normal">Last 30 Days</Badge>
                                        </div>

                                        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                                            <button className="px-3 py-1 bg-white rounded-md shadow-sm border border-slate-200/50 text-xs font-medium text-slate-900">Views</button>
                                            <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Recent</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {data.profile.posts.slice(0, 6).map((post: any) => (
                                            <div key={post.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] transition-all duration-200">
                                                {/* Thumbnail */}
                                                <div className="h-48 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                                                    {post.thumbnail ? (
                                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${post.thumbnail})` }}></div>
                                                    ) : (
                                                        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-300">
                                                            <Play className="w-10 h-10 opacity-20" />
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                        <button className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/40 hover:bg-white hover:text-black transition-colors">
                                                            <Play className="w-4 h-4 ml-0.5" />
                                                        </button>
                                                    </div>

                                                    <div className="absolute top-3 right-3">
                                                        <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                                                            <Eye className="w-3 h-3" /> {formatNumber(post.views)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="p-5">
                                                    {/* Insight Badge */}
                                                    {post.whyWorked && (
                                                        <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                                                            <Sparkles className="w-3 h-3" />
                                                            {post.whyWorked}
                                                        </div>
                                                    )}

                                                    <p className="text-sm text-slate-800 font-medium line-clamp-2 leading-relaxed mb-4 group-hover:text-indigo-600 transition-colors">
                                                        {post.caption}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                                        <span className="flex items-center gap-1.5">
                                                            <Heart className="w-3.5 h-3.5" /> {formatNumber(post.likes)}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <MessageCircle className="w-3.5 h-3.5" /> {formatNumber(post.comments)}
                                                        </span>
                                                        <span className="ml-auto text-slate-400 font-normal">
                                                            {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
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

function StatsCard({ label, value, icon: Icon, subtext, highlight }: any) {
    return (
        <div className={`
            p-5 rounded-xl border transition-all duration-200
            ${highlight
                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-slate-300'
            }
        `}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${highlight ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-500'}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <h4 className={`text-2xl font-bold mb-1 tracking-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</h4>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
                {subtext && <p className={`text-[11px] mt-1 ${highlight ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>}
            </div>
        </div>
    );
}

function formatNumber(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
