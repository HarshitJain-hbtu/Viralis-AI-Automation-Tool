'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useBusinessStore } from '@/lib/store/businessStore';
import { Button } from '@/components/ui/button';
import { Save, Building2, MapPin, Mic } from 'lucide-react';
import { Header } from "@/components/dashboard/Headers";

export default function SettingsPage() {
    const { user, checkAuth } = useAuthStore();
    const { updateProfile, isLoading } = useBusinessStore();

    // Form State
    const [industryMode, setIndustryMode] = useState('');
    const [city, setCity] = useState('');
    const [tone, setTone] = useState('');
    const [description, setDescription] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && user.businessId && typeof user.businessId === 'object') {
            const business = user.businessId as any;
            setIndustryMode(business.industryMode || 'Other');
            setCity(business.location?.city || '');
            setTone(business.brandVoice?.tone || 'Professional');
            setDescription(business.description || '');
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            await updateProfile({
                industryMode,
                location: { city },
                brandVoice: { tone },
                description,
            });
            await checkAuth(); // Refresh user state
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />
            <main className="px-8 py-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your business profile and AI preferences.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Business Profile</h2>
                        <p className="text-sm text-gray-500">Configure how the AI understands your business.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                Industry Mode (The AI Brain)
                            </label>
                            <select
                                value={industryMode}
                                onChange={(e) => setIndustryMode(e.target.value)}
                                className="block w-full max-w-md pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
                            >
                                <option>Dentist</option>
                                <option>Gym</option>
                                <option>Real Estate</option>
                                <option>Salon</option>
                                <option>Cafe</option>
                                <option>Other</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-400">Determines the content strategy and keywords.</p>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Location (For Local SEO)
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g. New York, NY"
                            />
                        </div>

                        {/* Brand Voice */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Mic className="w-4 h-4 text-gray-400" />
                                Brand Voice Tone
                            </label>
                            <div className="flex gap-3">
                                {['Professional', 'Friendly', 'Witty', 'Urgent'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${tone === t ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="block w-full max-w-xl px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Describe your business services and unique selling points..."
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <div className="pt-4 flex items-center gap-4">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
