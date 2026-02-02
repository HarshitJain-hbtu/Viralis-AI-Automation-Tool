'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push('/dashboard');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <Link href="/" className="flex items-center gap-0 mb-16">
                        <img src="/logo.png" alt="V" className="w-8 h-8 brightness-0 invert" />
                        <span className="text-xl font-bold -ml-0.5">iralis</span>
                    </Link>

                    <h1 className="text-5xl font-serif italic leading-tight mb-6">
                        Welcome back to your
                        <span className="text-blue-400"> growth engine.</span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 max-w-md">
                        Continue automating your business with AI-powered voice agents, content creation, and competitor intelligence.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3">
                        {['AI Voice Agent', 'Content Studio', 'Competitor Spy'].map((feature) => (
                            <div
                                key={feature}
                                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-gray-300"
                            >
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="mt-16 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl max-w-md">
                        <p className="text-gray-300 italic mb-4">
                            "Viralis transformed how we handle leads. The AI voice agent books 3x more meetings than our previous solution."
                        </p>
                        <div className="flex items-center gap-3">
                            <img
                                src="https://i.pravatar.cc/100?u=testimonial_login"
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-medium text-white">Sarah Johnson</p>
                                <p className="text-xs text-gray-500">Sales Director, TechCorp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-0 mb-10">
                        <img src="/logo.png" alt="V" className="w-7 h-7" />
                        <span className="text-lg font-bold text-gray-900 -ml-0.5">iralis</span>
                    </Link>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
                        <p className="text-gray-500">
                            Access your dashboard and continue growing your business.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Get started free
                            </Link>
                        </p>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <span>Trusted by 5,000+ businesses worldwide</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
