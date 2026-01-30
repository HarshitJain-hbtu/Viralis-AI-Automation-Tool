import { Bot, Mic, BarChart3, Zap, Shield, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-gray-50 mx-4 mb-4 rounded-[2.5rem] pt-24 pb-12 overflow-hidden border border-gray-100 shadow-sm">

            {/* Dot Grid Background - High Density */}
            <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

            <div className="relative max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-12 mb-24">
                    {/* Left Headings */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/logo.png" alt="Viralis Logo" className="h-10 w-auto" />
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Experience the future <br />
                            of business voice.
                        </h2>
                        <p className="text-xl text-gray-500 max-w-md">
                            Join thousands of forward-thinking companies automating their growth with Viralis.
                        </p>
                    </div>

                    {/* Right Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Solutions</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">API Docs</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Scattered Floating Icons Area */}
                <div className="relative h-80 w-full max-w-6xl mx-auto mb-16 hidden md:block select-none pointer-events-none">

                    {/* Icon 1: User - Left Top */}
                    <div className="absolute top-0 left-[-5%] w-32 h-32 -rotate-12 animate-float z-10">
                        <img src="/user.png" alt="User" className="w-full h-full object-contain drop-shadow-2xl opacity-90" />
                    </div>

                    {/* Icon 2: Chart - Left Center */}
                    <div className="absolute top-24 left-[25%] w-32 h-32 rotate-6 z-20 animate-float-delayed">
                        <img src="/chart.png" alt="Analytics" className="w-full h-full object-contain drop-shadow-2xl" />
                    </div>

                    {/* Icon 3: Bell - Center Top */}
                    <div className="absolute -top-12 left-[50%] -translate-x-1/2 w-32 h-32 -rotate-6 animate-float z-10">
                        <img src="/bell.png" alt="Notifications" className="w-full h-full object-contain drop-shadow-2xl opacity-90" />
                    </div>

                    {/* Icon 4: Rocket - Right Top */}
                    <div className="absolute top-10 right-[-5%] w-32 h-32 -rotate-12 animate-float z-20">
                        <img src="/rocket.png" alt="Launch" className="w-full h-full object-contain drop-shadow-2xl" />
                    </div>

                    {/* Icon 5: Calendar - Right Bottom */}
                    <div className="absolute bottom-0 right-[15%] w-32 h-32 rotate-12 transition-transform animate-float z-10">
                        <img src="/calendar.png" alt="Tasks" className="w-full h-full object-contain drop-shadow-xl opacity-80" />
                    </div>

                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2024 Viralis Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
