'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const INTEGRATIONS = [
    {
        id: 'youtube',
        name: 'YouTube',
        image: '/icons/youtube.png',
        testimonial: {
            quote: "Viralis helps me schedule content across all my channels. The AI generates thumbnails and descriptions that actually get views.",
            author: "Sarah M.",
            role: "Content Creator",
            avatar: "https://i.pravatar.cc/150?u=sarah_creator"
        }
    },
    {
        id: 'instagram',
        name: 'Instagram',
        image: '/icons/instagram.png',
        testimonial: {
            quote: "The voice agent handles my DMs and books calls for me. I've never missed a lead since using Viralis.",
            author: "Mike T.",
            role: "Business Owner",
            avatar: "https://i.pravatar.cc/150?u=mike_owner"
        }
    },
    {
        id: 'gemini',
        name: 'Gemini',
        image: '/icons/gemini.png',
        isCenter: true,
        testimonial: {
            quote: "The AI understands my brand voice perfectly. It writes content that sounds exactly like me but 10x faster.",
            author: "Lisa Chen",
            role: "Marketing Director",
            avatar: "https://i.pravatar.cc/150?u=lisa_marketing"
        }
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        image: '/icons/tiktok.png',
        testimonial: {
            quote: "We grew from 0 to 50k followers in 2 months. The competitor spy feature shows us exactly what's trending.",
            author: "David K.",
            role: "Social Media Manager",
            avatar: "https://i.pravatar.cc/150?u=david_social"
        }
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        image: '/icons/linkedin.png',
        testimonial: {
            quote: "B2B lead generation on autopilot. The voice agent qualifies leads and books meetings directly to my calendar.",
            author: "Jennifer R.",
            role: "Sales Director",
            avatar: "https://i.pravatar.cc/150?u=jennifer_sales"
        }
    }
];

export default function Integrations() {
    const [activeIndex, setActiveIndex] = useState(2); // Start with Gemini (center)

    // Cycle testimonials automatically
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % INTEGRATIONS.length);
        }, 5000); // Switch every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const activeIntegration = INTEGRATIONS[activeIndex];

    return (
        <section id="solutions" className="py-24 bg-white overflow-hidden">
            <div className="w-full max-w-[1920px] mx-auto text-center relative z-10">
                <div className="px-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
                        <Globe className="w-3 h-3" />
                        Ecosystem
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-serif text-gray-900 mb-6 italic tracking-tight">
                        Connect All Your Platforms
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Manage your entire social presence from one dashboard. Viralis integrates with the platforms you already use.
                    </p>
                </div>

                {/* Arch Circuit Visualization */}
                <div className="relative w-full h-[500px] flex items-center justify-center mt-10 select-none">

                    {/* SVG Circuit Line - Full Width Smooth Arc */}
                    <svg className="absolute inset-x-0 bottom-0 w-full h-full pointer-events-none" viewBox="0 0 1600 600" preserveAspectRatio="none">
                        {/* Gradient definition for the path */}
                        <defs>
                            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0" />
                                <stop offset="20%" stopColor="#cbd5e1" stopOpacity="1" />
                                <stop offset="80%" stopColor="#cbd5e1" stopOpacity="1" />
                                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Smooth Bezier Curve - Starts low/wide, arches up to center */}
                        <path
                            d="M -100 600 C 300 600, 400 150, 800 150 C 1200 150, 1300 600, 1700 600"
                            stroke="url(#arcGradient)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Central Testimonial Area */}
                    <div className="absolute top-[350px] left-1/2 -translate-x-1/2 text-center z-10 w-full max-w-2xl px-4">
                        <div key={activeIntegration.id} className="animate-in fade-in zoom-in-95 duration-700">
                            <p className="text-2xl font-serif italic text-gray-800 mb-8 leading-relaxed">
                                "{activeIntegration.testimonial.quote}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <img src={activeIntegration.testimonial.avatar} alt={activeIntegration.testimonial.author} className="w-12 h-12 rounded-full border border-gray-100 shadow-sm" />
                                <div className="text-left">
                                    <p className="text-base font-bold text-gray-900">{activeIntegration.testimonial.author}</p>
                                    <p className="text-sm text-gray-500">{activeIntegration.testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arc Nodes - 3D Icons (Static positions, no active state interaction) */}
                    {INTEGRATIONS.map((app, index) => {
                        // Adjusted positions to sit ON the line (offset by ~5-10% to account for center anchor)
                        const positions = [
                            { left: '18%', top: '65%' },  // YouTube (Lower)
                            { left: '32%', top: '35%' },  // Instagram (Mid)
                            { left: '50%', top: '25%' },   // Gemini (Peak - 150px/600px = 25%)
                            { right: '32%', top: '35%', left: 'auto' }, // TikTok
                            { right: '18%', top: '65%', left: 'auto' }  // LinkedIn
                        ];
                        const pos = positions[index];

                        return (
                            <div
                                key={app.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-transform duration-300 cursor-pointer z-20"
                                style={{
                                    left: pos.left !== 'auto' ? pos.left : undefined,
                                    right: pos.right,
                                    top: pos.top,
                                    transform: pos.right ? 'translate(50%, -50%)' : 'translate(-50%, -50%)'
                                }}
                                // Optional: User can manually click to view that testimonial if they want,
                                // but the visual state of the icon won't change drastically.
                                onClick={() => setActiveIndex(index)}
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                                        <img
                                            src={app.image}
                                            alt={app.name}
                                            className="w-full h-full object-contain filter drop-shadow-lg" // Consistent refined shadow
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}
