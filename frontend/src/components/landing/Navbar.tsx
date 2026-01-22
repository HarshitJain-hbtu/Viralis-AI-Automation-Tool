'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import GlassSurface from '@/components/ui/GlassSurface';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Threshold to trigger the effect
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className={`pointer-events-auto transition-all duration-[800ms] cubic-bezier(0.32, 0.72, 0, 1) ${isScrolled ? 'w-auto' : 'w-auto min-w-[300px]'
                }`}>
                <GlassSurface
                    borderRadius={50}
                    borderWidth={0}
                    backgroundOpacity={0.05}
                    mixBlendMode="normal"
                    brightness={1}
                    blur={20}
                    className="shadow-2xl shadow-black/10"
                    style={{
                        background: 'rgba(255, 255, 255, 0.8)', // Switched to Light Glass to match user's dark text
                        backdropFilter: 'blur(20px) saturate(1.8)',
                        border: '1px solid rgba(255, 255, 255, 0.4)'
                    }}
                >
                    <div className={`flex items-center transition-all duration-[1200ms] cubic-bezier(0.25, 0.8, 0.25, 1) ${isScrolled ? 'px-3 py-2 gap-3' : 'px-3 py-2 gap-20'
                        }`}>

                        {/* Logo Section */}
                        <div className="flex items-center shrink-0 justify-center">
                            {/* Logo Image */}
                            <div className="flex items-center justify-center shrink-0 relative z-20">
                                <img src="/logo.png" alt="V" className="w-6 h-6 object-contain" />
                            </div>

                            {/* Collapsible Text Title */}
                            <div className={`overflow-hidden flex flex-col justify-center transition-all duration-[1000ms] ease-out ${isScrolled ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                                }`}>
                                <span className="text-blue-600 font-bold text-3xl whitespace-nowrap tracking-tight">
                                    iralis
                                </span>
                            </div>
                        </div>

                        {/* Links Section - Center Collapsible */}
                        <div className={`hidden md:flex items-center overflow-hidden transition-all duration-[1200ms] cubic-bezier(0.25, 0.8, 0.25, 1) ${isScrolled ? 'max-w-0 opacity-0' : 'max-w-[600px] opacity-100'
                            }`}>
                            <div className="flex items-center gap-6 text-md font-medium text-gray-500 whitespace-nowrap px-2">
                                <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                                <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
                                <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                                <a href="#testimonials" className="hover:text-blue-600 transition-colors">Customers</a>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex items-center shrink-0 z-20">
                            <Link
                                href="/register"
                                className={`flex items-center gap-2 bg-blue-600 text-slate-200 text-sm font-bold rounded-full transition-all duration-500 shadow-lg shadow-black/10 ${isScrolled ? 'px-6 py-2.5' : 'px-6 py-2.5'
                                    }`}
                            >
                                <span className="whitespace-nowrap">Get Started</span>
                                <span className={`overflow-hidden transition-all duration-500 ease-out flex items-center ${isScrolled ? 'max-w-4 ml-1 opacity-100' : 'max-w-0 opacity-0'
                                    }`}>
                                    <ArrowRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </GlassSurface>
            </div>
        </div>
    );
}
