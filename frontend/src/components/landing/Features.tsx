import { Bot, Mic, BarChart3, ArrowRight, Play, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">

                {/* Feature 1: AI Engagement Agents */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-[320px] flex flex-col justify-center">
                            {/* Mock UI: Chat Interface */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-w-[280px] mx-auto w-full relative z-10">
                                <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Viralis Guard</p>
                                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Replying now
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-blue-50 rounded-lg rounded-tl-none p-3 text-xs text-blue-900 leading-relaxed">
                                        "Hey! Loved your recent video on AI trends. Would love to collab!"
                                    </div>
                                    <div className="bg-gray-100 rounded-lg rounded-tr-none p-3 text-xs text-gray-700 leading-relaxed ml-auto max-w-[85%]">
                                        (Auto-Reply) "Thanks for reaching out! Send us a DM with your portfolio."
                                    </div>
                                </div>
                            </div>
                            {/* Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Bot className="w-3 h-3" />
                            Smart Engagement
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight italic">
                            Reply to fans 24/7 without lifting a finger.
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Our AI agents manage your DMs, comments, and lead qualification instantly. Build a loyal community while you sleep.
                        </p>
                        <ul className="space-y-3">
                            {['Context-aware replies', 'Spam filtering', 'Automatic Lead Qualification'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Feature 2: Content Studio */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Mic className="w-3 h-3" />
                            Repurposing Engine
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight italic">
                            Turn one video into 10 viral shorts.
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Upload a long-form video and let Viralis extract the most viral moments, add captions, and schedule them across TikTok, Reel, and Shorts.
                        </p>
                        <div className="flex gap-4">
                            <div className="pl-4 border-l-2 border-purple-200">
                                <p className="text-2xl font-bold text-gray-900">10x</p>
                                <p className="text-sm text-gray-500">More Content</p>
                            </div>
                            <div className="pl-4 border-l-2 border-purple-200">
                                <p className="text-2xl font-bold text-gray-900">Zero</p>
                                <p className="text-sm text-gray-500">Editing Time</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-[320px] flex items-center justify-center">
                            {/* Mock UI: Content Card */}
                            <div className="relative w-full max-w-[260px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="h-32 bg-gray-900 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                            <Play className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-3 right-3">
                                        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-purple-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-16 bg-gray-200 rounded-full" />
                                        <div className="h-2 w-8 bg-purple-100 rounded-full" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2 w-full bg-gray-100 rounded-full" />
                                        <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                                        <div className="h-2 w-4/6 bg-gray-100 rounded-full" />
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-white" />
                                            <div className="w-6 h-6 rounded-full bg-gray-200 border border-white -ml-2" />
                                        </div>
                                        <div className="text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                            Viral Score: 98
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </div>
                </div>

                {/* Feature 3: Analytics */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-[320px] flex items-center justify-center">
                            {/* Mock UI: Chart */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full max-w-[300px]">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Reach</p>
                                        <p className="text-2xl font-bold text-gray-900">2.4M</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                                        <ArrowRight className="w-3 h-3 -rotate-45" />
                                        +42%
                                    </div>
                                </div>
                                <div className="flex items-end justify-between gap-2 h-32 mb-2">
                                    <div className="w-full bg-gray-100 rounded-t-sm h-[40%]" />
                                    <div className="w-full bg-gray-100 rounded-t-sm h-[60%]" />
                                    <div className="w-full bg-blue-100 rounded-t-sm h-[50%]" />
                                    <div className="w-full bg-blue-200 rounded-t-sm h-[75%]" />
                                    <div className="w-full bg-blue-500 rounded-t-sm h-[85%]" />
                                    <div className="w-full bg-blue-600 rounded-t-sm h-[100%]" />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                </div>
                            </div>
                            <div className="absolute bottom-right-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50" />
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <BarChart3 className="w-3 h-3" />
                            Viral Prediction
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight italic">
                            Know what goes viral <br /> before you post.
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Stop guessing. Our AI analyzes millions of data points to predict the viral potential of your content and suggests the best time to post.
                        </p>
                        <button className="text-green-700 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide">
                            View Live Demo <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
