"use client";
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function Pricing() {
    return (
        <section id="pricing" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-400 font-medium text-sm mb-8">
                        Pricing
                    </div>
                    <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Simple pricing plans</h2>
                    <p className="text-gray-400 text-lg">Detailed plans for every stage of your growth.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">

                    {/* Basic Plan */}
                    <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col">
                        <h3 className="text-xl font-medium text-gray-900 mb-1">Basic plan</h3>
                        <p className="text-gray-400 text-sm mb-8">Perfect for individuals.</p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-gray-900 tracking-tight">$5</span>
                            <span className="text-gray-400 font-medium">/mo</span>
                        </div>

                        <Link href="/register" className="block w-full py-4 px-6 bg-blue-600 text-white font-bold rounded-xl text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-10 group-hover:scale-[1.02] duration-200">
                            Get started
                        </Link>

                        <div className="space-y-4 mt-auto">
                            {['All product features', 'Unlimited lists & tasks', 'Priority support', 'Unlimited tasks', 'Unlimited file storage', 'Unlimited projects'].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-gray-900 flex-shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Plan - Blue Highlight + Floating 3D Icon */}
                    <div className="bg-blue-600 p-10 rounded-[2rem] shadow-2xl shadow-blue-600/30 relative transform lg:-translate-y-4 lg:scale-105 z-10 h-full flex flex-col">

                        {/* Floating 3D Icon (Calendar as requested) */}
                        <div className="absolute -top-10 right-8 w-32 h-32 rotate-12 animate-float">
                            <img src="/bell.png" alt="Pro Feature" className="w-full h-full object-contain drop-shadow-2xl" />
                        </div>

                        <h3 className="text-xl font-medium text-white/90 mb-1">Pro plan</h3>
                        <p className="text-blue-100 text-sm mb-8">Ideal for small teams.</p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-6xl font-bold text-white tracking-tight">$9</span>
                            <span className="text-blue-200 font-medium">/mo</span>
                        </div>

                        <p className="text-sm text-white font-medium mb-4">Best choice</p>

                        <Link href="/register" className="block w-full py-4 px-6 bg-white text-blue-600 font-bold rounded-xl text-center hover:bg-blue-50 transition-all shadow-lg mb-10 hover:scale-[1.02] duration-200">
                            Get started
                        </Link>

                        <div className="space-y-4 mt-auto">
                            {['All product features', 'Unlimited lists & tasks', 'Priority support', 'Unlimited tasks', 'Unlimited file storage', 'Unlimited projects'].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-white font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Plan */}
                    <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col">
                        <h3 className="text-xl font-medium text-gray-900 mb-1">Advanced plan</h3>
                        <p className="text-gray-400 text-sm mb-8">Best for large organizations.</p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-gray-900 tracking-tight">$15</span>
                            <span className="text-gray-400 font-medium">/mo</span>
                        </div>

                        <Link href="/register" className="block w-full py-4 px-6 bg-blue-600 text-white font-bold rounded-xl text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-10 group-hover:scale-[1.02] duration-200">
                            Get started
                        </Link>

                        <div className="space-y-4 mt-auto">
                            {['All product features', 'Unlimited lists & tasks', 'Priority support', 'Unlimited tasks', 'Unlimited file storage', 'Unlimited projects'].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-gray-900 flex-shrink-0" />
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
