import { Bot, Mic, BarChart3, ArrowRight, Play, MessageSquare, CheckCircle2, Phone, Search, Sparkles } from 'lucide-react';

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">

                {/* Feature 1: AI Voice Agent */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-[320px] flex flex-col justify-center">
                            {/* Mock UI: Call Interface */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-w-[280px] mx-auto w-full relative z-10">
                                <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">AI Voice Agent</p>
                                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            On call with lead
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-green-50 rounded-lg rounded-tl-none p-3 text-xs text-green-900 leading-relaxed">
                                        "Hi! I'm calling about your inquiry. How can I help you today?"
                                    </div>
                                    <div className="bg-gray-100 rounded-lg rounded-tr-none p-3 text-xs text-gray-700 leading-relaxed ml-auto max-w-[85%]">
                                        Customer: "I'd like to learn more about your services..."
                                    </div>
                                </div>
                            </div>
                            {/* Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Phone className="w-3 h-3" />
                            AI Voice Agent
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight italic">
                            Let AI handle your customer calls 24/7.
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Our AI voice agents make and receive calls, qualify leads, answer questions, and book appointments—all with natural, human-like conversations.
                        </p>
                        <ul className="space-y-3">
                            {['Natural voice conversations', 'Automatic lead qualification', 'Calendar integration'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
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
                            <Sparkles className="w-3 h-3" />
                            Content Studio
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight italic">
                            Create scroll-stopping content with AI.
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Generate captions, scripts, and posts tailored to your brand voice. Schedule and publish across all your social platforms from one dashboard.
                        </p>
                        <div className="flex gap-4">
                            <div className="pl-4 border-l-2 border-purple-200">
                                <p className="text-2xl font-bold text-gray-900">10x</p>
                                <p className="text-sm text-gray-500">Faster Content</p>
                            </div>
                            <div className="pl-4 border-l-2 border-purple-200">
                                <p className="text-2xl font-bold text-gray-900">Multi</p>
                                <p className="text-sm text-gray-500">Platform Support</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-[320px] flex items-center justify-center">
                            {/* Mock UI: Content Card */}
                            <div className="relative w-full max-w-[260px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="h-32 bg-gradient-to-br from-purple-600 to-indigo-600 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                            <Play className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-3 right-3">
                                        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-white" />
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
                                            AI Generated
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </div>
                </div>

                {/* Feature 3: Competitor Spy */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-[320px] flex items-center justify-center">
                            {/* Mock UI: Competitor Dashboard */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full max-w-[300px]">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Competitor Activity</p>
                                        <p className="text-2xl font-bold text-gray-900">12 Updates</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded-full">
                                        <Search className="w-3 h-3" />
                                        Live
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-red-100" />
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-900">Competitor A</p>
                                            <p className="text-[10px] text-gray-500">New product launch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-blue-100" />
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-900">Competitor B</p>
                                            <p className="text-[10px] text-gray-500">Pricing change detected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-right-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50" />
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Search className="w-3 h-3" />
                            Competitor Spy
                        </div>
                        <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight italic">
                            Know what your competitors do before they do.
                        </h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                            Track competitor websites, social media, and marketing moves in real-time. Get AI-powered insights to stay ahead of the competition.
                        </p>
                        <button className="text-orange-700 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide">
                            See It In Action <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
