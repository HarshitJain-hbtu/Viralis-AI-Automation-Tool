'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VIRALIS
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
          AI-Powered Voice-to-Business <br />
          <span className="text-blue-600">Automation Platform</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mb-10">
          Transform voice calls into actionable business intelligence.
          Orchestrate workflows, generate content, and manage leads automatically.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Automating <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-200 transition">
            View Demo
          </button>
        </div>
      </main>
    </div>
  );
}