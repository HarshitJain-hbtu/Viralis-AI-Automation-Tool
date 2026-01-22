import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-12 lg:p-20 overflow-hidden shadow-2xl shadow-blue-900/30">

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    {/* Floating Icons */}
                    <div className="absolute top-10 right-10 hidden lg:block animate-float">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Ready to transform <br className="hidden md:block" />
                            your business?
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                            Join thousands of forward-thinking companies automating their growth with Viralis. No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 hover:scale-105 duration-300"
                            >
                                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                href="#pricing"
                                className="inline-flex items-center justify-center px-6 py-3 text-white/90 rounded-full text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
