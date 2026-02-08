'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/authStore';
import { Youtube } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function SocialConnect() {
    const { token, fetchSocialStats, socialStats, disconnectSocial } = useAuthStore();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const socialConnected = searchParams.get('social_connected');
        if (socialConnected) {
            fetchSocialStats();
            // Optional: Clean up URL
            router.replace('/dashboard');
        }
    }, [searchParams, fetchSocialStats, router]);

    const handleConnect = async (provider: 'youtube' | 'facebook' | 'facebook-mock') => {
        if (!token) return;

        // Dynamic import to avoid circular dependencies if any, though likely safe here.
        // Better to import at top level if possible, but let's stick to the pattern or just import 'api'.
        const { default: api } = await import('@/lib/api/client');

        if (provider === 'facebook-mock') {
            try {
                await api.post('/auth/facebook/mock');
                fetchSocialStats();
                router.replace('/dashboard?social_connected=facebook-mock');
            } catch (err) {
                console.error('Mock connect failed', err);
            }
            return;
        }

        // Use the configured baseURL from the axio instance + /auth/provider
        // This ensures we use the same URL that API calls usage.
        const backendUrl = api.defaults.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        // Ensure no double slashes if baseURL ends with / (axios usually doesn't, but good to be safe)
        const cleanBaseUrl = backendUrl.replace(/\/+$/, '');

        window.location.href = `${cleanBaseUrl}/auth/${provider}?token=${token}`;
    };

    const handleDisconnect = async (provider: string) => {
        if (confirm(`Are you sure you want to disconnect ${provider}?`)) {
            await disconnectSocial(provider);
        }
    };

    const isYoutubeConnected = !!socialStats?.youtube;
    const isFacebookConnected = !!socialStats?.facebook;

    return (
        <Card className='!bg-white !text-gray-900 !border-gray-200'>
            <CardHeader>
                <CardTitle className="!text-gray-900">Connect Social Accounts</CardTitle>
                <CardDescription className="!text-gray-500">Connect your accounts to view analytics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Youtube className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-medium !text-gray-900">YouTube</p>
                            <p className="text-sm !text-gray-500">
                                {isYoutubeConnected ? `Connected as ${socialStats?.youtube?.channelTitle || 'YouTube Channel'}` : 'Connect channel'}
                            </p>
                        </div>
                    </div>
                    {isYoutubeConnected ? (
                        <Button variant="outline" className="!bg-white !text-red-600 hover:!text-red-700 hover:!bg-red-50 !border-gray-200" onClick={() => handleDisconnect('youtube')}>
                            Disconnect
                        </Button>
                    ) : (
                        <Button variant="outline" className="!bg-white !text-gray-900 !border-gray-200 hover:!bg-gray-50" onClick={() => handleConnect('youtube')}>
                            Connect
                        </Button>
                    )}
                </div>


            </CardContent>
            <CardContent className="space-y-4 pt-0">
                {/* Facebook Connect */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white text-[14px] font-bold">f</div>
                        <div>
                            <p className="font-medium !text-gray-900">Facebook Page</p>
                            <p className="text-sm !text-gray-500">
                                {isFacebookConnected ? `Connected as ${socialStats.facebook?.pageName || ''}` : 'Connect business page'}
                            </p>
                        </div>
                    </div>
                    {isFacebookConnected ? (
                        <Button variant="outline" className="!bg-white !text-red-600 hover:!text-red-700 hover:!bg-red-50 !border-gray-200" onClick={() => handleDisconnect('facebook')}>
                            Disconnect
                        </Button>
                    ) : (
                        <Button variant="outline" className="!bg-white !text-gray-900 !border-gray-200 hover:!bg-gray-50" onClick={() => handleConnect('facebook')}>
                            Connect
                        </Button>
                    )}
                </div>

                {/* Instagram Connect */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-md flex items-center justify-center text-white">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </div>
                        <div>
                            <p className="font-medium !text-gray-900">Instagram Business</p>
                            <p className="text-sm !text-gray-500">Connect via Facebook</p>
                        </div>
                    </div>
                    {isFacebookConnected ? (
                        <Button variant="ghost" disabled className="text-xs text-gray-400">
                            Linked to FB
                        </Button>
                    ) : (
                        <Button variant="outline" className="!bg-white !text-gray-900 !border-gray-200 hover:!bg-gray-50" onClick={() => handleConnect('facebook')}>
                            Connect
                        </Button>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
