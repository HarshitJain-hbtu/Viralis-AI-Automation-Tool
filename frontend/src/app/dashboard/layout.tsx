'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Headers';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, token, checkAuth } = useAuthStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            router.push('/login');
        } else {
            if (!user) {
                checkAuth().catch(() => router.push('/login'));
            } else {
                // Check onboarding status
                const business = user.businessId as any; // Type assertion since it might be populated
                if (business && typeof business === 'object' && (business.onboardingStep || 0) < 3) {
                    router.push('/onboarding');
                }
            }
        }
    }, [router, user, checkAuth]);

    if (!isMounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
