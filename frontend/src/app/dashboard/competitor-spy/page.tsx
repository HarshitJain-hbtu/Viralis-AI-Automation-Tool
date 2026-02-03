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
    Play,
    Share2,
    MoreHorizontal,
    Download,
    Cpu,
    Activity,
    FileText
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

    // Derived state for transitions
    const hasData = !!data || isAnalyzing;

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900">

            <main className="max-w-[1280px] mx-auto px-6 pt-8">

                {/* Hard-coded Page Title Section - Part of Layout Flow */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white shadow-sm">
                            <Target className="w-3.5 h-3.5" />
                        </div>
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>
                        <h1 className="text-sm font-semibold text-slate-900">Competitor Intelligence</h1>
                        <span className="hidden md:inline-block text-xs text-slate-400 font-medium ml-2">v2.1</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-medium hidden md:block">
                            Analyze any public profile
                        </span>
                    </div>
                </div>

                {/* Command Interface */}
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${hasData ? 'mb-8' : 'max-w-2xl mx-auto mt-[5vh]'}`}>

                    {/* Input Label (Only in empty state) */}
                    {!hasData && (
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">Target Profile</label>
                        </div>
                    )}

                    {/* The Command Bar */}
                    <div className={`
                        relative group flex flex-col md:flex-row p-1.5 rounded-xl border transition-all duration-200 shadow-sm
                        ${isAnalyzing
                            ? 'bg-slate-50 border-slate-200 opacity-80 cursor-wait'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md ring-0 focus-within:ring-2 focus-within:ring-slate-100 focus-within:border-slate-400'
                        }
                    `}>

                        {/* Platform Toggle - Segmented Control Style */}
                        <div className="flex p-1 bg-slate-100/50 rounded-lg md:mr-2 border border-slate-100">
                            <button
                                onClick={() => setPlatform('instagram')}
                                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${platform === 'instagram' ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Instagram
                            </button>
                            <button
                                onClick={() => setPlatform('youtube')}
                                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${platform === 'youtube' ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                YouTube
                            </button>
                        </div>

                        {/* Input Field */}
                        <div className="flex-1 relative">
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={platform === 'instagram' ? "e.g. alexhormozi" : "e.g. tubeBuddy"}
                                className="h-10 md:h-full w-full border-0 bg-transparent shadow-none focus-visible:ring-0 text-base font-medium placeholder:text-slate-300 text-slate-900 px-3"
                                autoFocus={!hasData}
                            />
                        </div>

                        {/* Execute Action */}
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !username}
                            className={`
                                mt-2 md:mt-0 px-6 rounded-lg font-semibold text-white shadow-sm transition-all duration-200
                                ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 hover:bg-slate-800 hover:shadow active:scale-[0.98]'}
                            `}
                        >
                            {isAnalyzing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2 text-xs tracking-wide">
                                    RUN ANALYSIS <ArrowRight className="w-3 h-3 opacity-50" />
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Educational Empty State (Only shows when no data) */}
                    {!hasData && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-12"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <span className="h-px flex-1 bg-slate-100"></span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Intelligence Capabilities</span>
                                <span className="h-px flex-1 bg-slate-100"></span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors group">
                                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Pattern Recognition</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Systematically identify recurring content structures and visual formats that drive engagement.</p>
                                </div>
                                <div className="p-5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors group">
                                    <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Performance Velocity</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Analyze growth rate and view acceleration to detect breakout content vs. steady growth.</p>
                                </div>
                                <div className="p-5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors group">
                                    <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Hook Extraction</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Log and categorize opening lines and visual hooks for replication in your content strategy.</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h4 className="text-[11px] font-semibold text-slate-400 mb-3 uppercase tracking-wide">Example Analyses</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['@hormozi', '@mrbeast', '@thinkmedia', '@cleo'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setUsername(tag.replace('@', ''))}
                                            className="px-3 py-1.5 rounded bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600 hover:bg-white hover:border-slate-300 hover:text-slate-900 transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Loading State */}
                {isAnalyzing && (
                    <div className="max-w-6xl mx-auto mt-12 space-y-8 animate-pulse opacity-50">
                        <div className="h-8 bg-slate-200 w-1/3 rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-slate-100 rounded-lg border border-slate-200"></div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results View - Precise & Dense */}
                {data && !isAnalyzing && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[1280px] mx-auto pb-20"
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{data.profile.username}</h2>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {data.profile.followers.toString().slice(0, 3)}... • REPORT GENERATED {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-xs bg-white hover:bg-slate-50 text-slate-600 border-slate-200">
                                        <Download className="w-3.5 h-3.5 mr-2" /> Export CSV
                                    </Button>
                                </div>
                            </div>

                            {/* Key Stats - Minimal Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <StatBox label="Audience Size" value={data.profile.followers.toLocaleString()} icon={Users} />
                                <StatBox label="Avg Views / Post" value={data.profile.avgViews.toLocaleString()} icon={Eye} sub="Based on last 30" />
                                <StatBox label="Engagement Rate" value={data.profile.engagementRate} icon={TrendingUp} sub="High Performance" highlight />
                                <StatBox label="Growth Velocity" value={data.profile.growthVelocity} icon={Zap} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Analysis Column */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-slate-400" /> Viral Patterns
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Identified Hooks</span>
                                                <ul className="mt-2 space-y-2">
                                                    {data.analysis.viralPatterns.hooks.map((hook: string, i: number) => (
                                                        <li key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100/50">
                                                            "{hook}"
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Visual Elements</span>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {data.analysis.viralPatterns.visuals.map((visual: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-600">
                                                            {visual}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 rounded-lg p-5 shadow-lg text-white">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Sparkles className="w-4 h-4 text-yellow-400" />
                                            <h3 className="text-sm font-semibold">Strategic Insight</h3>
                                        </div>
                                        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                                            <p><strong className="text-white block mb-1">Psychology:</strong> {data.analysis.whyItWorks.psychology}</p>
                                            <p><strong className="text-white block mb-1">Structure:</strong> {data.analysis.whyItWorks.structure}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-slate-900">Top Performing Content</h3>
                                        <div className="flex gap-1">
                                            <button className="px-2 py-1 text-[10px] font-medium bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">ListView</button>
                                            <button className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-200 text-slate-400 rounded hover:text-slate-900 transition-colors">GridView</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {data.profile.posts.map((post: any) => (
                                            <div key={post.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors group">
                                                <div className="h-40 bg-slate-100 relative group-hover:opacity-90 transition-opacity">
                                                    {post.thumbnail ? (
                                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.thumbnail})` }}></div>
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Play className="w-8 h-8 text-slate-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                                                        {formatNumber(post.views)}
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <p className="text-xs font-medium text-slate-900 line-clamp-2 leading-snug">{post.caption}</p>
                                                        {post.whyWorked && (
                                                            <span className="shrink-0 w-2 h-2 rounded-full bg-indigo-500" title="High Insight"></span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(post.likes)}</span>
                                                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatNumber(post.comments)}</span>
                                                        <span className="ml-auto text-slate-400">{new Date(post.date).toLocaleDateString()}</span>
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

function StatBox({ label, value, icon: Icon, sub, highlight }: any) {
    return (
        <div className={`
            p-4 rounded-lg border transition-all
            ${highlight ? 'bg-white border-indigo-100 ring-1 ring-indigo-50 shadow-sm' : 'bg-white border-slate-100 text-slate-900'}
        `}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <Icon className={`w-3.5 h-3.5 ${highlight ? 'text-indigo-500' : 'text-slate-300'}`} />
            </div>
            <div className="flex items-baseline gap-2">
                <h4 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h4>
                {highlight && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">▲ 12%</span>}
            </div>
            {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

function formatNumber(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
