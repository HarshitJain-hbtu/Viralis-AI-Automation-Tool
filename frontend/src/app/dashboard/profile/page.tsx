'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, updateUser, isLoading } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || ''); // New State
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        setIsSaving(true);
        try {
            await updateUser({ name, avatar }); // Send Avatar
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
                </div>

                {/* Profile Card */}
                <Card className="bg-white border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-lg overflow-hidden shrink-0">
                                <img
                                    src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'User'}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">{user?.name}</CardTitle>
                                <CardDescription className="text-gray-500">{user?.role || 'Account Owner'}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">

                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-9 !bg-white !border-gray-200 transition-colors h-11 !text-gray-900 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Avatar Upload (New) */}
                        <div className="grid gap-2">
                            <Label htmlFor="avatar-upload" className="text-gray-700 font-medium">Avatar Image</Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    className="!border-gray-200 !bg-white !text-gray-900 hover:!bg-gray-50"
                                >
                                    Choose Image
                                </Button>
                                <span className="text-sm text-gray-500">
                                    {avatar && avatar.startsWith('data:') ? 'Image selected' : 'No custom image selected'}
                                </span>
                            </div>
                            <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 100 * 1024) { // 100KB Limit
                                            toast.error('Image too large. Please use an image under 100KB.');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setAvatar(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-400">Max size 100KB. Using larger images may fail to save.</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="pl-9 !bg-gray-100 border-gray-200 !text-gray-500 cursor-not-allowed h-11"
                                />
                            </div>
                            <p className="text-xs text-gray-400">Email cannot be changed.</p>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-gray-700 font-medium">Associated Business</Label>
                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {typeof user?.businessId === 'object' ? (user.businessId as any).name : 'Viralis Business'}
                                    </p>
                                    <p className="text-xs text-blue-600 font-mono mt-0.5 truncate uppercase tracking-wider">
                                        ID: {typeof user?.businessId === 'object' ? (user.businessId as any)._id : user?.businessId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || isLoading}
                                className="bg-gray-900 hover:bg-black text-white px-8 h-11 font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
