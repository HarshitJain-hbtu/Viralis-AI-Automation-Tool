'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading, error, token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push('/dashboard');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            router.push('/onboarding');
        } catch (err) {
            // Error handled in store
        }
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        if (password.length === 0) return { level: 0, text: '', color: '' };
        if (password.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' };
        if (password.length < 10) return { level: 2, text: 'Medium', color: 'bg-yellow-500' };
        return { level: 3, text: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Sign Up Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-0 mb-10">
                        <img src="/logo.png" alt="V" className="w-7 h-7" />
                        <span className="text-lg font-bold text-gray-900 -ml-0.5">iralis</span>
                    </Link>

                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wide mb-4">
                            <Sparkles className="w-3 h-3" />
                            Free to get started
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
                        <p className="text-gray-500">
                            Start automating your business growth in minutes.
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
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Work Email
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
                                    placeholder="Create a strong password"
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
                            {/* Password Strength Indicator */}
                            {password.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${passwordStrength.color}`}
                                            style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                                        />
                                    </div>
                                    <span className={`text-xs font-medium ${passwordStrength.level === 1 ? 'text-red-500' :
                                        passwordStrength.level === 2 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Free Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Floating Circles */}
                <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <Link href="/" className="flex items-center gap-0 mb-16">
                        <img src="/logo.png" alt="V" className="w-8 h-8 brightness-0 invert" />
                        <span className="text-xl font-bold -ml-0.5">iralis</span>
                    </Link>

                    <h1 className="text-5xl font-serif italic leading-tight mb-6">
                        Everything you need to
                        <span className="text-blue-200"> grow your business.</span>
                    </h1>

                    <p className="text-lg text-blue-100 mb-12 max-w-md">
                        Join thousands of businesses using Viralis to automate content, manage leads, and stay ahead of competitors.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 mb-12">
                        {[
                            'AI Voice Agents that book calls 24/7',
                            'Content Studio with multi-platform publishing',
                            'Real-time competitor monitoring',
                            'Lead management dashboard'
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-blue-50">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                        <div>
                            <p className="text-3xl font-bold">5,000+</p>
                            <p className="text-sm text-blue-200">Active Businesses</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">1M+</p>
                            <p className="text-sm text-blue-200">AI Calls Made</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">50K+</p>
                            <p className="text-sm text-blue-200">Content Generated</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
