'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessStore } from '@/lib/store/businessStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function OnboardingPage() {
    const router = useRouter();
    const { updateProfile, isLoading } = useBusinessStore();
    // Replaced useAuthStore here as we want to access user for initial check
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (user) {
            const business = user.businessId as any;
            if (business?.onboardingStep >= 3) {
                router.replace('/dashboard');
            }
        }
    }, [user, router]);

    // Step 1: Foundation
    const [industryMode, setIndustryMode] = useState('Dentist');
    const [city, setCity] = useState('');

    // Step 2: The Brain
    const [tone, setTone] = useState('Professional');
    const [description, setDescription] = useState('');

    const handleNext = async () => {
        if (step === 3) {
            await finishOnboarding();
        } else {
            setStep(step + 1);
        }
    };

    const finishOnboarding = async () => {
        try {
            await updateProfile({
                industryMode,
                location: { city },
                brandVoice: { tone },
                description,
                onboardingStep: 3
            });
            await useAuthStore.getState().checkAuth(); // Refresh user state to see new onboardingStep
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">

                {/* Progress Bar */}
                <div className="flex justify-between mb-8">
                    <div className={`h-2 w-1/3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`h-2 w-1/3 rounded-full mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`h-2 w-1/3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Step 1: The Foundation</h2>
                        <p className="text-gray-500">Let's configure your industry mode and location for SEO.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Industry Mode</label>
                            <select
                                value={industryMode}
                                onChange={(e) => setIndustryMode(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option>Dentist</option>
                                <option>Gym</option>
                                <option>Real Estate</option>
                                <option>Salon</option>
                                <option>Cafe</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">City (for Local SEO)</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g. New York"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Step 2: The Brain</h2>
                        <p className="text-gray-500">Teach the AI how to speak like you.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand Voice</label>
                            <div className="mt-2 flex gap-4">
                                {['Professional', 'Friendly', 'Witty', 'Urgent'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-4 py-2 rounded-lg border ${tone === t ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Tell the AI about your business..."
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-bold">You're All Set!</h2>
                        <p className="text-gray-500">We have everything we need to start generating content.</p>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-medium text-blue-900">Your AI Agent is Ready</h3>
                            <p className="text-blue-700 mt-2">Mode: {industryMode}</p>
                            <p className="text-blue-700">Location: {city}</p>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (step === 3 ? 'Go to Dashboard' : 'Next Step')}
                    </button>
                </div>

            </div>
        </div>
    );
}
