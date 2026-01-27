import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 px-6 bg-white overflow-hidden relative border-t border-gray-50">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(240,240,255,0.8),transparent_70%)] opacity-60 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles className="w-3 h-3" />
                    <span>Start your journey</span>
                </div>

                {/* Main Headline - Serif & Editorial */}
                <h2 className="text-6xl md:text-7xl font-serif text-gray-900 mb-8 leading-[1.1] tracking-tight">
                    Ready to turn content <br />
                    <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        into currency?&nbsp;&nbsp;
                    </span>
                </h2>

                <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join the creators and brands who are automating their growth with Viralis.
                    No credit card required.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/register"
                        className="group relative inline-flex items-center justify-center px-10 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-900 transition-all hover:scale-105 duration-300 shadow-xl shadow-gray-200"
                    >
                        Start for Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/demo"
                        className="inline-flex items-center justify-center px-10 py-5 bg-white border border-gray-200 text-gray-900 rounded-full text-lg font-medium hover:bg-gray-50 transition-all hover:border-gray-300"
                    >
                        Book a Demo
                    </Link>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <div className="flex -space-x-3 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <img
                                key={i}
                                src={`https://i.pravatar.cc/100?u=viralis${i}`}
                                alt="User"
                                className="w-10 h-10 rounded-full border-2 border-white"
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                        Trusted by <span className="text-gray-900 font-bold">10,000+</span> creators and brands
                    </p>
                </div>
            </div>

            {/* Connecting Visual Element to Footer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-gray-200" />

            {/* Subtle Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </section>
    );
}
