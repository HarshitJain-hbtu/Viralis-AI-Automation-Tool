'use client';

import { useState, useEffect } from 'react';
import { useContentStore } from '@/lib/store/contentStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Copy,
    Sparkles,
    Instagram,
    Youtube,
    Clock,
    TrendingUp,
    CheckCircle2,
    Loader2,
    Video,
    Lightbulb,
    FileText,
    Users,
    Target,
    Zap,
    Film,
    Type,
    Save,
    Download,
    RefreshCw,
    BarChart3,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Image as ImageIcon,
    Mic,
    Globe,
    Settings,
    Wand2,
    Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced mock data
const mockReelContent = {
    hook: "Stop scrolling! In the next 30 seconds, I'll show you the #1 mistake that's costing you customers...",
    hookAlternatives: [
        "POV: You're losing $5,000/month because of this one mistake...",
        "I made this mistake for 2 years. Here's how I fixed it.",
        "The #1 reason your business isn't growing (and how to fix it)",
        "This changed everything for my business. Here's why."
    ],
    script: [
        { time: "0-3s", type: "Hook", text: "Stop scrolling! In the next 30 seconds, I'll show you the #1 mistake that's costing you customers...", onScreenText: "STOP! ⚠️", visual: "Close-up, urgent expression" },
        { time: "3-8s", type: "Problem", text: "Most businesses make this critical error in their first 90 days...", onScreenText: "The Mistake", visual: "Split screen showing problem" },
        { time: "8-15s", type: "Solution", text: "But here's the secret: focus on ONE thing that actually moves the needle.", onScreenText: "The Solution", visual: "Before/after comparison" },
        { time: "15-25s", type: "Proof", text: "I helped 50+ businesses double their revenue using this exact method.", onScreenText: "50+ Success Stories", visual: "Testimonial cards" },
        { time: "25-30s", type: "CTA", text: "Book a free consultation link in bio. Let's grow your business together.", onScreenText: "BOOK NOW →", visual: "CTA button overlay" }
    ],
    voiceover: {
        script: "Stop scrolling! In the next 30 seconds, I'll show you the #1 mistake that's costing you customers. Most businesses make this critical error in their first 90 days. But here's the secret: focus on ONE thing that actually moves the needle. I helped 50+ businesses double their revenue using this exact method. Book a free consultation link in bio. Let's grow your business together.",
        pacing: "Fast-paced, energetic",
        tone: "Urgent but friendly"
    },
    visualPlan: [
        { scene: 1, shot: "Close-up talking head", duration: "3s", description: "Urgent expression, direct eye contact" },
        { scene: 2, shot: "B-roll: Problem visualization", duration: "5s", description: "Split screen showing common mistakes" },
        { scene: 3, shot: "Screen recording / Graphics", duration: "7s", description: "Show the solution with on-screen text" },
        { scene: 4, shot: "Social proof montage", duration: "10s", description: "Quick cuts of testimonials, results" },
        { scene: 5, shot: "CTA overlay", duration: "5s", description: "Clear call-to-action with booking link" }
    ],
    caption: "Ready to transform your business? 🚀\n\nI've helped 50+ businesses double their revenue by fixing this ONE critical mistake.\n\nBook a free consultation today and see the difference! 👆\n\nLink in bio for instant booking.\n\n#BusinessGrowth #SuccessTips #EntrepreneurLife #MarketingStrategy #SmallBusiness #GrowthHacking",
    hashtags: [
        "#BusinessGrowth",
        "#SuccessTips",
        "#EntrepreneurLife",
        "#MarketingStrategy",
        "#SmallBusiness",
        "#GrowthHacking",
        "#BusinessTips",
        "#DigitalMarketing",
        "#StartupLife",
        "#Entrepreneurship"
    ],
    aiScores: {
        virality: 87,
        clarity: 92,
        conversion: 85,
        hookStrength: 91,
        audienceMatch: 88
    },
    improvements: [
        { type: "hook", suggestion: "Make hook 0.5s shorter for better retention", priority: "high" },
        { type: "cta", suggestion: "Add urgency with 'Limited spots this week'", priority: "medium" },
        { type: "visual", suggestion: "Add more text overlays in first 3 seconds", priority: "high" }
    ]
};

export default function StudioPage() {

    // Advanced form state
    const [platform, setPlatform] = useState<'instagram' | 'youtube'>('instagram');
    const [goal, setGoal] = useState<'appointments' | 'awareness' | 'offers'>('appointments');
    const [tone, setTone] = useState<'professional' | 'friendly' | 'trendy'>('professional');
    const [hookStyle, setHookStyle] = useState<'shock' | 'curiosity' | 'authority' | 'storytelling'>('curiosity');
    const [reelLength, setReelLength] = useState<'7s' | '15s' | '30s'>('30s');
    const [visualStyle, setVisualStyle] = useState<'talking-head' | 'b-roll' | 'text-only' | 'stock' | 'ugc'>('talking-head');
    const [ctaType, setCtaType] = useState<'dm' | 'link' | 'comment' | 'book-now'>('book-now');
    const [language, setLanguage] = useState('en-US');
    const [trendMode, setTrendMode] = useState<'safe' | 'aggressive'>('safe');
    const [targetAge, setTargetAge] = useState('25-45');
    const [targetCity, setTargetCity] = useState('');
    const [targetInterest, setTargetInterest] = useState('business-growth');
    const [businessType, setBusinessType] = useState('Dentist');
    const [customPrompt, setCustomPrompt] = useState('');

    // UI state
    // AI State
    const { generateContent, isGenerating, generatedResult } = useContentStore();
    const [aiContent, setAiContent] = useState<any>(null);

    // UI state
    const [hasGenerated, setHasGenerated] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'script' | 'visual' | 'caption' | 'hooks'>('script');
    const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

    // Business type options
    const businessTypes = ['Dentist', 'Gym', 'Real Estate', 'Salon', 'Cafe', 'Other'];

    // Age range options
    const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+', '25-45', '30-50'];

    // City suggestions
    const citySuggestions = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];

    // Interest options
    const interestOptions = ['business-growth', 'fitness', 'real-estate', 'beauty', 'food', 'technology', 'marketing', 'entrepreneurship', 'finance', 'health'];

    // Effect to parse JSON result
    useEffect(() => {
        if (generatedResult) {
            try {
                // If the result is a JSON string, parse it
                const parsed = typeof generatedResult === 'string' ? JSON.parse(generatedResult) : generatedResult;
                setAiContent(parsed);
                setHasGenerated(true);
            } catch (e) {
                console.error("Failed to parse AI result", e);
                // Fallback implementation or error toast could go here
            }
        }
    }, [generatedResult]);

    // Use mock content as fallback if no AI content yet
    const displayContent = aiContent || mockReelContent;

    const handleGenerate = async () => {
        if (!customPrompt && !businessType) return; // Basic validation

        setHasGenerated(false);
        setAiContent(null);

        await generateContent(
            customPrompt || `Promotional video for ${businessType}`,
            'reel_script',
            tone,
            {
                targetAge,
                targetInterest,
                businessType,
                platform
            }
        );
    };

    const handleRegenerate = async (_type: string) => {
        // setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        // setIsGenerating(false);
        // In real app, would update specific part of content
    };

    const handleCopy = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600 bg-green-50';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">

            <main className="max-w-[1600px] mx-auto px-8 py-6">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reels Studio</h1>
                        <p className="text-gray-500 mt-1">Gemini 3 Powered Content Engine</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {hasGenerated && (
                            <>
                                <Button variant="outline" size="sm" className="gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                                    <Save className="w-4 h-4" />
                                    Save to Library
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                                    <Download className="w-4 h-4" />
                                    Export
                                </Button>
                            </>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                            <Sparkles className="w-4 h-4" />
                            Gemini 3 Powered
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Enhanced Left Panel */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 sticky top-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900">Generator</h2>
                                <Settings className="w-4 h-4 text-gray-400" />
                            </div>

                            {/* Platform & Basic Settings */}
                            <div className="space-y-5 pb-6 border-b border-gray-100">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Platform
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setPlatform('instagram')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${platform === 'instagram'
                                                ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Instagram className="w-4 h-4" />
                                            Instagram
                                        </button>
                                        <button
                                            onClick={() => setPlatform('youtube')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${platform === 'youtube'
                                                ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Youtube className="w-4 h-4" />
                                            YouTube
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Business Type
                                    </label>
                                    <select
                                        value={businessType}
                                        onChange={(e) => setBusinessType(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all h-11"
                                    >
                                        {businessTypes.map((type) => (
                                            <option key={type} value={type} className="text-gray-900 bg-white">
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Content Strategy */}
                            <div className="space-y-5 pb-6 border-b border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Target className="w-3 h-3" />
                                    Content Strategy
                                </h3>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2.5">Goal</label>
                                    <div className="space-y-2">
                                        {(['appointments', 'awareness', 'offers'] as const).map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setGoal(g)}
                                                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${goal === g
                                                    ? 'bg-gray-900 text-white border-gray-900 font-medium'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {g.charAt(0).toUpperCase() + g.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Tone</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['professional', 'friendly', 'trendy'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTone(t)}
                                                className={`px-2 py-2 rounded-lg border text-xs transition-all ${tone === t
                                                    ? 'bg-gray-900 text-white border-gray-900 font-medium'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Hook Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['shock', 'curiosity', 'authority', 'storytelling'] as const).map((h) => (
                                            <button
                                                key={h}
                                                onClick={() => setHookStyle(h)}
                                                className={`px-2 py-2 rounded-lg border text-xs transition-all ${hookStyle === h
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {h.charAt(0).toUpperCase() + h.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Production Settings */}
                            <div className="space-y-5 pb-6 border-b border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Film className="w-3 h-3" />
                                    Production
                                </h3>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Length</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['7s', '15s', '30s'] as const).map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => setReelLength(l)}
                                                className={`px-2 py-2 rounded-lg border text-xs transition-all ${reelLength === l
                                                    ? 'bg-gray-900 text-white border-gray-900 font-medium'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Visual Style</label>
                                    <select
                                        value={visualStyle}
                                        onChange={(e) => setVisualStyle(e.target.value as 'talking-head' | 'b-roll' | 'text-only' | 'stock' | 'ugc')}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent h-11"
                                    >
                                        <option value="talking-head" className="text-gray-900 bg-white">Talking Head</option>
                                        <option value="b-roll" className="text-gray-900 bg-white">B-Roll</option>
                                        <option value="text-only" className="text-gray-900 bg-white">Text Only</option>
                                        <option value="stock" className="text-gray-900 bg-white">Stock Footage</option>
                                        <option value="ugc" className="text-gray-900 bg-white">UGC Style</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">CTA Type</label>
                                    <select
                                        value={ctaType}
                                        onChange={(e) => setCtaType(e.target.value as 'dm' | 'link' | 'comment' | 'book-now')}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent h-11"
                                    >
                                        <option value="dm" className="text-gray-900 bg-white">DM Me</option>
                                        <option value="link" className="text-gray-900 bg-white">Link in Bio</option>
                                        <option value="comment" className="text-gray-900 bg-white">Comment Below</option>
                                        <option value="book-now" className="text-gray-900 bg-white">Book Now</option>
                                    </select>
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div className="space-y-5 pb-6 border-b border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    Target Audience
                                </h3>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Age Range</label>
                                    <select
                                        value={targetAge}
                                        onChange={(e) => setTargetAge(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent h-11"
                                    >
                                        {ageRanges.map((age) => (
                                            <option key={age} value={age} className="text-gray-900 bg-white">
                                                {age}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">City</label>
                                    <select
                                        value={targetCity}
                                        onChange={(e) => setTargetCity(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent h-11"
                                    >
                                        <option value="" className="text-gray-500 bg-white">Select a city...</option>
                                        {citySuggestions.map((city) => (
                                            <option key={city} value={city} className="text-gray-900 bg-white">
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Interest</label>
                                    <select
                                        value={targetInterest}
                                        onChange={(e) => setTargetInterest(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent h-11"
                                    >
                                        {interestOptions.map((interest) => (
                                            <option key={interest} value={interest} className="text-gray-900 bg-white">
                                                {interest.charAt(0).toUpperCase() + interest.slice(1).replace('-', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Advanced */}
                            <div className="space-y-5 pb-6 border-b border-gray-100">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                                        <Globe className="w-3 h-3" />
                                        Language
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent h-11"
                                    >
                                        <option value="en-US" className="text-gray-900 bg-white">English (US)</option>
                                        <option value="es-ES" className="text-gray-900 bg-white">Spanish</option>
                                        <option value="fr-FR" className="text-gray-900 bg-white">French</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2.5">Trend Mode</label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setTrendMode('safe')}
                                            className={`flex-1 px-3 py-2 rounded-lg border text-xs transition-all ${trendMode === 'safe'
                                                ? 'bg-green-50 border-green-200 text-green-700 font-medium'
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Safe
                                        </button>
                                        <button
                                            onClick={() => setTrendMode('aggressive')}
                                            className={`flex-1 px-3 py-2 rounded-lg border text-xs transition-all ${trendMode === 'aggressive'
                                                ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium'
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            Aggressive
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Prompt Section */}
                            <div className="space-y-5">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    Custom Prompt
                                </h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">
                                        Additional Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder="Add specific requirements, topics, or messaging you want the AI to focus on..."
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Help AI understand your unique needs and preferences
                                    </p>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full bg-gray-900 text-white hover:bg-gray-800 h-12 text-base font-semibold gap-2 shadow-sm"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Reel
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Center Panel with Tabs */}
                    <div className="lg:col-span-6">
                        {!hasGenerated && !isGenerating ? (
                            // Enhanced Empty State
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-16 text-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Video className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Create Viral Reels?</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    Configure your settings on the left and let AI generate high-performing reel content tailored to your business.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Powered by Google Gemini 3</span>
                                </div>
                            </div>
                        ) : isGenerating ? (
                            // Enhanced Loading State
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-5 bg-gray-100 rounded w-1/3"></div>
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Generated Content with Tabs
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                                {/* Tabs */}
                                <div className="border-b border-gray-100">
                                    <div className="flex">
                                        {(['script', 'visual', 'caption', 'hooks'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${activeTab === tab
                                                    ? 'text-gray-900 bg-white'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                                {activeTab === tab && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="p-8">
                                    {activeTab === 'script' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                        <Film className="w-5 h-5 text-gray-900" />
                                                        Reel Script Timeline
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mt-1">Scene-by-scene breakdown optimized for retention</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRegenerate('hook')}
                                                        className="gap-2"
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Regenerate Hook
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCopy(mockReelContent.script.map(s => s.text).join('\n\n'), 'full-script')}
                                                        className="gap-2"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        Copy All
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {mockReelContent.script.map((step, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Badge variant="outline" className="text-xs font-mono uppercase tracking-wider text-gray-500 border-gray-200">
                                                                            {step.time}
                                                                        </Badge>
                                                                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 uppercase text-[10px] tracking-wider font-bold">
                                                                            {step.type}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-900 font-medium leading-relaxed text-base">{step.text}</p>
                                                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50 mt-3">
                                                                    <div className="flex items-start gap-3">
                                                                        <Type className="w-4 h-4 text-gray-400 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">On-Screen Text</p>
                                                                            <p className="text-sm font-medium text-gray-700">{step.onScreenText}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3">
                                                                        <Video className="w-4 h-4 text-gray-400 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Visual Direction</p>
                                                                            <p className="text-sm font-medium text-gray-700">{step.visual}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Voiceover Section */}
                                            <div className="bg-purple-50 rounded-xl border border-purple-100 p-6 mt-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                                        <Mic className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">Voiceover Script</h4>
                                                        <p className="text-xs text-purple-600 font-medium">Ready for TTS Generation</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg border border-purple-100 p-4 mb-4 shadow-sm">
                                                    <p className="text-gray-700 leading-relaxed font-medium">&quot;{mockReelContent.voiceover.script}&quot;</p>
                                                </div>
                                                <div className="flex gap-6 text-sm">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pacing</span>
                                                        <p className="font-semibold text-gray-900 mt-1">{mockReelContent.voiceover.pacing}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tone</span>
                                                        <p className="font-semibold text-gray-900 mt-1">{mockReelContent.voiceover.tone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'visual' && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Visual Production Plan</h3>
                                            {mockReelContent.visualPlan.map((scene, index) => (
                                                <div key={index} className="bg-white rounded-xl border border-gray-100 p-5">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                            {scene.scene}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="font-semibold text-gray-900">{scene.shot}</h4>
                                                                <Badge variant="outline">{scene.duration}</Badge>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{scene.description}</p>
                                                        </div>
                                                        <ImageIcon className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'caption' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-gray-900">Caption & Hashtags</h3>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCopy(mockReelContent.caption, 'caption')}
                                                    className="gap-2"
                                                >
                                                    {copiedField === 'caption' ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            Copy Caption
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{mockReelContent.caption}</p>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-900">Hashtags</h4>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCopy(mockReelContent.hashtags.join(' '), 'hashtags')}
                                                        className="gap-2"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        Copy All
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {mockReelContent.hashtags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="px-3 py-1.5 text-sm">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'hooks' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-gray-900">Hook Alternatives</h3>
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    Best: Option 1
                                                </Badge>
                                            </div>
                                            {mockReelContent.hookAlternatives.map((hook, index) => (
                                                <div key={index} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant="outline">Option {index + 1}</Badge>
                                                                {index === 0 && (
                                                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                                                        Recommended
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-800 font-medium leading-relaxed">{hook}</p>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
                                                            <button
                                                                onClick={() => handleCopy(hook, `hook-${index}`)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                            >
                                                                {copiedField === `hook-${index}` ? (
                                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Right Panel - AI Insights */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6 sticky top-6">
                            {/* AI Scores */}
                            {hasGenerated && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-gray-900">AI Performance Scores</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(mockReelContent.aiScores).map(([key, score]) => (
                                            <div key={key}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${getScoreColor(score)}`}>
                                                        {score}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Why This Reel Works - Expandable */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                                <button
                                    onClick={() => setExpandedInsight(expandedInsight === 'why' ? null : 'why')}
                                    className="flex items-center justify-between w-full mb-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Why This Reel Works</h3>
                                    </div>
                                    {expandedInsight === 'why' ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                                {expandedInsight === 'why' && (
                                    <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Hook addresses specific pain point</strong> - Creates immediate connection with target audience</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Script follows proven pattern</strong> - Problem → Solution → Proof → CTA structure maximizes engagement</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Clear CTA with urgency</strong> - Direct call-to-action increases conversion likelihood</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Optimized hashtags</strong> - Mix of broad and niche tags improves discoverability</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Improvement Suggestions */}
                            {hasGenerated && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {mockReelContent.improvements.map((improvement, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${improvement.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                                                        }`} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="outline" className="text-xs">
                                                                {improvement.type}
                                                            </Badge>
                                                            <Badge className={`text-xs ${improvement.priority === 'high'
                                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                }`}>
                                                                {improvement.priority} priority
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-700">{improvement.suggestion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Best Posting Time */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Best Posting Time</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                                        <span className="text-sm font-medium text-gray-700">Today</span>
                                        <span className="text-sm font-bold text-purple-700">6:00 PM</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">Tomorrow</span>
                                        <span className="text-sm text-gray-600">7:30 PM</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">This Week</span>
                                        <span className="text-sm text-gray-600">6-9 PM</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    Based on your audience&apos;s activity patterns
                                </p>
                            </div>

                            {/* Quick Actions */}
                            {hasGenerated && (
                                <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
                                    <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRegenerate('trendier')}
                                            className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
                                        >
                                            <Zap className="w-3 h-3" />
                                            Make it Trendier
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRegenerate('professional')}
                                            className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
                                        >
                                            <Wand2 className="w-3 h-3" />
                                            Make it Professional
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRegenerate('cta')}
                                            className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
                                        >
                                            <Target className="w-3 h-3" />
                                            Improve CTA
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
