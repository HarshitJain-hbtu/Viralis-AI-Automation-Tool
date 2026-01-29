'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/authStore';
import { Youtube } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function SocialConnect() {
    const { token, fetchSocialStats } = useAuthStore();
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
        // We pass the token in the state/query param so backend can identify user.
        // However, passport-google-oauth20 flow is initiated by backend.
        // If we use standard link, we can't easily pass the Bearer token header.
        // We will pass it as a query param `state` (holding the token) which the backend will verify.
        // The backend expects `state` or `token`. In our routes we used `state` for passport logic, 
        // but `req.query.token` in the route handler. 
        // Let's check `socialRoutes.ts`: `const state = req.query.token as string;`

        if (!token) return;

        if (provider === 'facebook-mock') {
            try {
                // We need to import api client here or use fetch with token
                // Importing api client is better but might cause circular dep if not careful.
                // Let's use fetch for this specific mock action or try to use the store action if we had one.
                // For quickness, let's just use the `api` client import if available or fetch.
                // We didn't import api here yet. Let's do it.
                const { default: api } = await import('@/lib/api/client');
                await api.post('/auth/facebook/mock');
                fetchSocialStats();
                router.replace('/dashboard?social_connected=facebook-mock');
            } catch (err) {
                console.error('Mock connect failed', err);
            }
            return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        window.location.href = `${backendUrl}/auth/${provider}?token=${token}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connect Social Accounts</CardTitle>
                <CardDescription>Connect your accounts to view analytics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Youtube className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-medium">YouTube</p>
                            <p className="text-sm text-muted-foreground">Connect channel</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => handleConnect('youtube')}>
                        Connect
                    </Button>
                </div>


            </CardContent>
            <CardContent className="space-y-4 pt-0">
                {/* Facebook Connect */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white text-[14px] font-bold">f</div>
                        <div>
                            <p className="font-medium">Facebook Page</p>
                            <p className="text-sm text-muted-foreground">Connect business page</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => handleConnect('facebook')}>
                        Connect
                    </Button>
                </div>

                {/* Instagram Connect */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-md flex items-center justify-center text-white">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </div>
                        <div>
                            <p className="font-medium">Instagram Business</p>
                            <p className="text-sm text-muted-foreground">Connect via Facebook</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => handleConnect('facebook')}>
                        Connect
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}
