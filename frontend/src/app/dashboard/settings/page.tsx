'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useBusinessStore } from '@/lib/store/businessStore';
import { Button } from '@/components/ui/button';
import { Save, Building2, MapPin, Mic, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';


export default function SettingsPage() {
    const { user, checkAuth } = useAuthStore();
    const { updateProfile, isLoading } = useBusinessStore();

    // Form State
    const [name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [logoPreview, setLogoPreview] = useState('');
    const [industryMode, setIndustryMode] = useState('');
    const [customIndustry, setCustomIndustry] = useState('');
    const [city, setCity] = useState('');
    const [tone, setTone] = useState('');
    const [description, setDescription] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const logoInputRef = useRef<HTMLInputElement>(null);

    const INDUSTRIES = ['Dentist', 'Gym', 'Real Estate', 'Salon', 'Cafe'];

    useEffect(() => {
        if (user && user.businessId && typeof user.businessId === 'object') {
            const business = user.businessId as any;
            setName(business.name || '');
            setLogo(business.logo || '');
            setLogoPreview(business.logo || '');

            const savedIndustry = business.industryMode || '';
            if (INDUSTRIES.includes(savedIndustry)) {
                setIndustryMode(savedIndustry);
            } else if (savedIndustry) {
                setIndustryMode('Other');
                setCustomIndustry(savedIndustry);
            } else {
                setIndustryMode('Other');
            }

            setCity(business.location?.city || '');
            setTone(business.brandVoice?.tone || 'Professional');
            setDescription(business.description || '');
        }
    }, [user]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setLogo(base64);
            setLogoPreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setLogo('');
        setLogoPreview('');
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            await updateProfile({
                name,
                logo,
                industryMode: industryMode === 'Other' ? customIndustry : industryMode,
                location: { city },
                brandVoice: { tone },
                description,
            });
            await checkAuth();
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

            <main className="px-8 py-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your business profile and AI preferences.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Business Profile</h2>
                        <p className="text-sm text-gray-500">Configure how the AI understands your business.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Business Logo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                Business Logo
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group">
                                    {logoPreview ? (
                                        <>
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                            <button
                                                onClick={handleRemoveLogo}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </>
                                    ) : (
                                        <Building2 className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Logo
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB. Shows on your share card.</p>
                                </div>
                            </div>
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                Business Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                Industry Mode (The AI Brain)
                            </label>
                            <div className="space-y-3">
                                <select
                                    value={industryMode}
                                    onChange={(e) => setIndustryMode(e.target.value)}
                                    className="block w-full max-w-md pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
                                >
                                    <option value="Dentist">Dentist</option>
                                    <option value="Gym">Gym</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Salon">Salon</option>
                                    <option value="Cafe">Cafe</option>
                                    <option value="Other">Other</option>
                                </select>

                                {industryMode === 'Other' && (
                                    <input
                                        type="text"
                                        value={customIndustry}
                                        onChange={(e) => setCustomIndustry(e.target.value)}
                                        className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm animate-in fade-in slide-in-from-top-1"
                                        placeholder="Enter your specific industry (e.g., SaaS, E-commerce)"
                                    />
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-400">Determines the content strategy and keywords.</p>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Location (For Local SEO)
                            </label>
                            <Input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="max-w-md bg-white"
                                placeholder="e.g. New York, NY"
                            />
                        </div>

                        {/* Brand Voice */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Mic className="w-4 h-4 text-gray-400" />
                                Brand Voice Tone
                            </label>
                            <div className="flex gap-3 flex-wrap">
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
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="max-w-xl bg-white"
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
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-8 rounded-lg shadow-sm"
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
