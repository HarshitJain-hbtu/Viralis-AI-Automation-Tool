'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register, isLoading, error, token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push('/dashboard');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            router.push('/dashboard');
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Login to VIRALIS' : 'Create an Account'}
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:underline"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                </div>

                <div className="mt-2 text-center text-sm">
                    <Link href="/" className="text-gray-500 hover:text-gray-700">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
