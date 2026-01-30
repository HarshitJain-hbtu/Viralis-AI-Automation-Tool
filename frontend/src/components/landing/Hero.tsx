import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="pt-32 pb-24 px-6 bg-white overflow-hidden relative">

            {/* Background Grid */}
            <div className="absolute inset-0 z-0">
                <img src="/grid.jpg" alt="" className="w-full h-full object-repeat opacity-40" />
                {/* Gradient Overlay to fade grid into white at the bottom/edges for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-white/60" />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wide mb-8 hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-600/20">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    Powered by Gemini 3.0
                </div>

                {/* Headline */}
                <h1 className="text-5xl lg:text-7xl font-serif tracking-tight text-gray-900 leading-[1.1] max-w-4xl mb-6 italic">
                    Turn Your Content Into <br />
                    <span className="text-blue-600 font-sans not-italic tracking-tighter">Exponential Growth.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-10 mx-auto">
                    The first AI-powered growth engine that repurposes your content, predicts viral trends, and engages with your audience 24/7.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 mb-20">
                    <Link
                        href="/register"
                        className="flex items-center justify-center px-8 py-4 bg-[#0F172A] text-white rounded-full text-lg font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                        Start Growing Free <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                {/* Dashboard Image */}
                <div className="relative w-full max-w-6xl mx-auto perspective-1000">
                    {/* Background Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-t from-blue-100 via-purple-100 to-transparent rounded-[2rem] blur-3xl opacity-50 -z-10" />

                    {/* Main Image Container */}
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200/60 overflow-hidden transform transition-transform hover:scale-[1.01] duration-700">
                        {/* Mac-style Window Header for extra realism */}
                        <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        {/* The Dashboard Image */}
                        <img
                            src="/hero.png"
                            alt="Viralis Dashboard"
                            className="w-full h-auto object-cover"
                        />

                        {/* Optional: Add a fade at the bottom if the image cuts off abruptly, or keep it clean */}
                        <div className="absolute inset-0 ring-1 ring-black/5 rounded-xl pointer-events-none" />
                    </div>

                    {/* Floating UI Elements matching the design vibe (optional ornamentation) */}
                    <div className="absolute -left-12 top-1/4 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 hidden lg:flex items-center gap-4 animate-float-delayed z-20">
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src="/calendar.png" alt="Viral Score" className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Viral Score</p>
                            <p className="text-base font-bold text-gray-900">98/100</p>
                        </div>
                    </div>

                    <div className="absolute -right-8 bottom-1/3 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 hidden lg:flex items-center gap-4 animate-float z-20">
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src="/rocket.png" alt="Growth" className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Followers</p>
                            <p className="text-base font-bold text-gray-900">+12.4k</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}