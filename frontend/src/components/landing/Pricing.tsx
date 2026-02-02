"use client";
import Link from 'next/link';
import { CheckCircle2, Zap } from 'lucide-react';

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-400 font-medium text-sm mb-8">
                        Pricing
                    </div>
                    <h2 className="text-5xl font-serif text-gray-900 mb-4 tracking-tight italic">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400 text-lg">AI-powered CRM & Content tools for every business.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">

                    {/* Free Plan */}
                    <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Free Forever</h3>
                            <p className="text-gray-400 text-sm">Try Viralis with limited features.</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-gray-900 tracking-tight">$0</span>
                            <span className="text-gray-400 font-medium">/mo</span>
                        </div>

                        <Link href="/register" className="block w-full py-4 px-6 bg-gray-50 text-gray-900 font-bold rounded-xl text-center hover:bg-gray-100 transition-all mb-10 group-hover:scale-[1.02] duration-200">
                            Start for Free
                        </Link>

                        <div className="space-y-4 mt-auto">
                            {[
                                '1 Content Generation/day',
                                '2 Hours Voice Agent/month',
                                '1 Social Account',
                                '10 Leads Storage',
                                'Basic Analytics',
                                '7 Days Data Retention'
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Growth Plan - highlighted */}
                    <div className="bg-blue-600 p-10 rounded-[2rem] shadow-2xl shadow-blue-600/30 relative transform lg:-translate-y-4 lg:scale-105 z-10 h-full flex flex-col">

                        {/* Floating 3D Icon */}
                        <div className="absolute -top-12 right-6 w-32 h-32 animate-float">
                            <img src="/rocket.png" alt="Growth" className="w-full h-full object-contain drop-shadow-2xl" />
                        </div>

                        <div className="mb-4 relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
                                <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                                Best for Growth
                            </div>
                            <h3 className="text-xl font-bold text-white">Growth</h3>
                            <p className="text-blue-100 text-sm">For growing businesses.</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-8 relative z-10">
                            <span className="text-6xl font-bold text-white tracking-tight">$19</span>
                            <span className="text-blue-200 font-medium pb-2">/mo</span>
                        </div>

                        <Link href="/register" className="block w-full py-4 px-6 bg-white text-blue-600 font-bold rounded-xl text-center hover:bg-blue-50 transition-all shadow-lg mb-10 hover:scale-[1.02] duration-200 relative z-10">
                            Start Free Trial
                        </Link>

                        <div className="space-y-4 mt-auto relative z-10">
                            {[
                                'Unlimited Content Generation',
                                '10 Hours Voice Agent/month',
                                '3 Social Accounts',
                                'Unlimited Leads',
                                'Content Studio (Full Access)',
                                'Competitor Intelligence',
                                'AI Insights Dashboard',
                                '30 Days Data Retention'
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-white font-medium">
                                    <div className="p-0.5 bg-blue-500 rounded-full">
                                        <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                                    </div>
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Agency Plan */}
                    <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Agency</h3>
                            <p className="text-gray-400 text-sm">For teams & agencies.</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-gray-900 tracking-tight">$49</span>
                            <span className="text-gray-400 font-medium">/mo</span>
                        </div>

                        <Link href="/contact" className="block w-full py-4 px-6 bg-white border-2 border-gray-100 text-gray-900 font-bold rounded-xl text-center hover:border-gray-300 transition-all mb-10 group-hover:scale-[1.02] duration-200">
                            Contact Sales
                        </Link>

                        <div className="space-y-4 mt-auto">
                            {[
                                'Everything in Growth',
                                'Unlimited Voice Agent Hours',
                                '10 Social Accounts',
                                '5 Team Members',
                                'White-label Reports',
                                'API Access',
                                'Dedicated Support',
                                'Unlimited Data Retention'
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

